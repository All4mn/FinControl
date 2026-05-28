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

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    const response = await database.query(
      `INSERT INTO conta (id_usuario, id_moeda, nome_conta, saldo_conta)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id_usuario, id_moeda, nome_conta, saldo_conta],
    );
    return response.rows[0];
  }

  async update(id, { id_usuario, id_moeda, nome_conta, saldo_conta }) {
    const response = await database.query(
      `UPDATE conta 
       SET id_usuario = $1, id_moeda = $2, nome_conta = $3, saldo_conta = $4
       WHERE id_conta = $5
       RETURNING *`,
      [id_usuario, id_moeda, nome_conta, saldo_conta, id],
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM conta WHERE id_conta = $1",
      [id],
    );
    return response.rowCount > 0;
  }
}
