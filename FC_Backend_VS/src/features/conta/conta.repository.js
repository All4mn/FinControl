// =============================================================================
// models/repositories/conta.repository.js
// Acesso ao banco de dados para a tabela de conta
// =============================================================================

import database from "../../config/db.js";

export class ContaRepository {
// Delega ao helper de config/db.js, que trata a falha do ROLLBACK.
  async withTransaction(operation) {
    return database.withTransaction(operation);
  }

  // Só ativas: é o que exclui contas arquivadas do saldo consolidado.
  async findAll() {
    const response = await database.query(
      "SELECT * FROM conta WHERE ativo = TRUE ORDER BY id_conta DESC",
    );
    return response.rows;
  }

  // Sem filtro de ativo: é o que permite desarquivar.
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

  async findAllByUsuario(id_usuario) {
    const response = await database.query(
      "SELECT * FROM conta WHERE id_usuario = $1 AND ativo = TRUE ORDER BY id_conta DESC",
      [id_usuario],
    );
    return response.rows;
  }

  async archiveByUsuario(id_usuario) {
    const response = await database.query(
      `UPDATE conta
       SET ativo = FALSE
       WHERE id_usuario = $1
       RETURNING *`,
      [id_usuario],
    );
    return response.rows;
  }

  // 'client' opcional: roda dentro da transação de conta.service.create.
  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }, client = null) {
    const executor = client || database;
    const response = await executor.query(
      `INSERT INTO conta (id_usuario, id_moeda, nome_conta, saldo_conta, ativo)
       VALUES ($1, $2, $3, $4, TRUE)
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

// Soft delete, como transacao.arquivado: saldo e transações ficam intactos,
  // então desarquivar restaura tudo.
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

  // LEFT JOIN em usuario/moeda: o schema permite os dois nulos e um INNER JOIN
  // fazia a conta sumir da lista sem erro. apenasAtivas omite arquivadas para as
  // telas operacionais; a de gestão usa a lista completa para reativar.
  async search(id, apenasAtivas = false){
    const response = await database.query(`
      SELECT c.id_conta, c.id_usuario, c.id_moeda, c.nome_conta, c.saldo_conta,
             u.nome_usuario AS nome_user, m.nome_moeda AS moeda, c.ativo
      FROM conta c
      LEFT JOIN usuario u ON u.id_usuario = c.id_usuario
      LEFT JOIN moeda m ON m.id_moeda = c.id_moeda
      WHERE c.id_usuario = $1
        AND ($2::boolean IS FALSE OR c.ativo = TRUE)
      ORDER BY c.ativo DESC, c.id_conta DESC
      `,[id, apenasAtivas])

    return response.rows
  }

  async findUserById(id){
    const response = await database.query(`
      SELECT * FROM usuario WHERE id_usuario = $1
      `,[id])

    return response.rows[0] || null
  }
}
