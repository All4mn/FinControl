// =============================================================================
// models/repositories/conta.repository.js
// Acesso ao banco de dados para a tabela de conta
// =============================================================================

import database from "../../config/db.js";

export class ContaRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM conta ORDER BY id_conta DESC",
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM conta WHERE id_conta = $1",
      [id],
    );
    return response.rows[0] || null;
  }

  async findByIdAndUsuario(id, id_usuario) {
    const response = await database.query(
      "SELECT * FROM conta WHERE id_conta = $1 AND id_usuario = $2",
      [id, id_usuario],
    );
    return response.rows[0] || null;
  }

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    const response = await database.query(
      `INSERT INTO conta (id_usuario, id_moeda, nome_conta, saldo_conta)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, id_moeda, nome_conta, saldo_conta],
    );
    return response.rows[0];
  }

  async update(id, nome_conta) {
    const response = await database.query(
      `UPDATE conta 
       SET nome_conta = $1
       WHERE id_conta = $2
       RETURNING *`,
      [nome_conta, id],
    );
    return response.rows[0] || null;
  }

  async arquivar(id) {
    const response = await database.query(
      `UPDATE conta
      SET ativo = FALSE
      WHERE id_conta = $1
      RETURNING *`,
      [id],
    );
    return response.rowCount > 0;
  }

  async desarquivar(id){
    const response = await database.query(
      `
      UPDATE conta
      SET ativo = TRUE
      WHERE id_conta = $1 
      RETURNING *
      `,[id]
    )
    return response.rowCount > 0;
  }

  // Busca todas as contas associadas a um usuário específico
  // Realiza INNER JOIN entre tabelas conta e usuario
  // Retorna: array contendo id_conta, id_usuario, id_moeda, nome_conta, saldo_conta e nome_usuario
  async search(id){
    // Query que faz INNER JOIN entre conta e usuario
    // Seleciona dados da conta + nome do usuário
    // Filtra apenas as contas do usuário especificado
    const response = await database.query(`
      SELECT c.id_conta, c.id_usuario, c.id_moeda, c.nome_conta, c.saldo_conta, u.nome_usuario AS nome_user, m.nome_moeda AS moeda, c.ativo
      FROM conta c 
      INNER JOIN usuario u ON c.id_usuario = u.id_usuario 
      INNER JOIN moeda m ON c.id_moeda = m.id_moeda
      WHERE c.id_usuario = $1
      `,[id])
      
    // Retorna apenas as linhas (rows) da resposta
    return response.rows
  }

  // Busca um usuário específico pelo ID
  // Retorna: objeto com dados do usuário ou null se não encontrado
  async findUserById(id){
    // Query que busca o usuário pelo ID
    const response = await database.query(`
      SELECT * FROM usuario WHERE id_usuario = $1
      `,[id])
      
    // Retorna o primeiro resultado (única linha) ou null se não existir
    return response.rows[0] || null
  }
}
