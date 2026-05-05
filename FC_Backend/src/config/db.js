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
        this.pool = new Pool({
            connectionString: process.env.DB_CONNECTION_STRING
        });
    }

    // Método opcional para testar a conexão inicial.
    // Chama pool.connect() para estabelecer uma conexão e verificar se está tudo ok.
    // Em produção, pode ser chamado no startup da aplicação para validar a configuração.
    // Para replicar: Use em aplicações onde você quer confirmar a conectividade no início.
    async connection(){
        try {
            await this.pool.connect();
            console.log('Conexão com o banco de dados estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
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