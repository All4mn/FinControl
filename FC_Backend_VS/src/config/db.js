import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

// Classe responsável por gerenciar a conexão com o banco de dados PostgreSQL.
// Utiliza o Pool do pacote 'pg' para gerenciar conexões eficientemente,
// permitindo reutilização e controle de múltiplas conexões simultâneas.
// Isso é importante para aplicações que fazem muitas consultas ao banco,
// evitando overhead de abrir/fechar conexões repetidamente.
class database {
    constructor() {
        // No construtor, inicializamos o pool de conexões.
        // A connectionString contém todas as informações necessárias para conectar ao banco:
        // - Host: endereço do servidor do banco (ex: localhost)
        // - Port: porta onde o banco está escutando (ex: 5432)
        // - User: nome de usuário para autenticação
        // - Password: senha do usuário
        // - Database: nome do banco de dados a ser usado
        // Para replicar: Substitua a connectionString pela sua própria string de conexão
        // do PostgreSQL (pode vir de variáveis de ambiente para segurança).
        const connectionString = process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Defina DATABASE_URL ou DB_CONNECTION_STRING para conectar ao PostgreSQL.');
        }

        this.pool = new Pool({
            connectionString,
            connectionTimeoutMillis: 15000,
            max: Number(process.env.DB_POOL_MAX) || 10,
            idleTimeoutMillis: 30000,
            keepAlive: true,
            ssl:{
                rejectUnauthorized: false
            }
        });

        // Timeouts via SET no 'connect', nunca pelo campo 'options': o Neon
        // rejeita parâmetros de startup com 08P01 e TODA consulta vira 500.
        this.pool.on('connect', (client) => {
            client.query("SET lock_timeout = '5s'");
            client.query("SET statement_timeout = '10s'");
        });
    }

    // Método opcional para testar a conexão inicial.
    // Chama pool.connect() para estabelecer uma conexão e verificar se está tudo ok.
    // Em produção, pode ser chamado no startup da aplicação para validar a configuração.
    // Para replicar: Use em aplicações onde você quer confirmar a conectividade no início.
    async connection(){
        const client = await this.pool.connect();
        client.release();
    }

    // A função deve usar APENAS o client recebido, senão as queries saem da
    // transação. Se o ROLLBACK falhar, o client é descartado em vez de voltar
    // ao pool: o pg não faz rollback no release() e a conexão ficaria travada.
    async withTransaction(operacao) {
        const client = await this.pool.connect();
        let liberado = false;

        const liberar = (erro) => {
            if (liberado) return;
            liberado = true;
            client.release(erro);
        };

        try {
            await client.query('BEGIN');
            const resultado = await operacao(client);
            await client.query('COMMIT');
            liberar();
            return resultado;
        } catch (erro) {
            try {
                await client.query('ROLLBACK');
                liberar();
            } catch (erroRollback) {
                // Descarta a conexão: voltar ao pool deixaria locks abertos.
                liberar(erroRollback);
            }
            throw erro;
        }
    }

    // Método principal para executar queries SQL.
    // Recebe o texto da query e parâmetros opcionais (para prevenir SQL injection).
    // Retorna o resultado da query, que inclui rows (dados retornados).
    // Para replicar: Sempre use parâmetros preparados em vez de concatenação de strings
    // para segurança. Exemplo: query('SELECT * FROM tabela WHERE id = $1', [id])
    query(text, params) {
        return this.pool.query(text, params);
    }
}

// Exporta uma instância singleton da classe, para que toda a aplicação use a mesma pool.
// Para replicar: Em projetos maiores, considere múltiplas pools para diferentes bancos
// ou use um ORM como Prisma/Sequelize para abstrair ainda mais.
export default new database();