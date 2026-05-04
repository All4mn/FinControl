import database from '../config/db.js'

// Classe que representa o modelo de dados para usuários.
// No padrão MVC, o Model é responsável por interagir com os dados,
// seja do banco ou de fontes externas. Aqui, combina dados mock (para teste)
// com consultas reais ao banco PostgreSQL.
// Para replicar: Crie uma classe similar para cada entidade da sua aplicação,
// com métodos CRUD (Create, Read, Update, Delete) que chamam o database.
class usuarios {
    constructor(parameters) {
        // Dados mockados para desenvolvimento/teste.
        // Útil quando o banco ainda não tem dados ou para testes unitários.
        // Em produção, remova ou use apenas para fallbacks.
        // Para replicar: Substitua por dados reais ou deixe vazio se não precisar.
        this.usuarios = [{
            id: 1,
            nome: 'Maria',
            email: 'maria@gmail.com'
        },
        {
            id: 2,
            nome: 'João',
            email: 'joao@gmail.com'
        },
        {
            id: 3,
            nome: 'Ana',
            email: 'ana@gmail.com'
        }]
    }

    // Método para buscar todos os usuários do banco de dados.
    // Executa uma query SELECT * FROM usuario e retorna as linhas (rows).
    // Usa async/await para lidar com operações assíncronas do banco.
    // Para replicar: Adapte a query para suas necessidades, como filtros (WHERE),
    // ordenação (ORDER BY), ou joins. Sempre use prepared statements via params.
    async findAll(){
        const response = await database.query('SELECT * FROM usuario')
        return response.rows
    }

    async findUserByID(id){
        const response = await database.query("SELECT * FROM usuario WHERE id_usuario = $1", [id])
        return response.rows[0]
    }
}

// Exporta uma instância singleton, para que o controller use sempre a mesma.
// Para replicar: Em aplicações maiores, considere injeção de dependência
// ou use um ORM para mapear tabelas automaticamente.
export default new usuarios()