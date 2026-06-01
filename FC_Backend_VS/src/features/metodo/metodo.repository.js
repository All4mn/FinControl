// =============================================================================
// models/repositories/metodo.repository.js
// Acesso ao banco de dados para a tabela de metodo
// =============================================================================

import database from "../../config/db.js";

export class MetodoRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM metodo ORDER BY nome_metodo ASC",
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM metodo WHERE id_metodo = $1",
      [id],
    );
    return response.rows[0] || null;
  }

  async create({ nome_metodo }) {
    const response = await database.query(
      `INSERT INTO metodo (nome_metodo) VALUES ($1) RETURNING *`,
      [nome_metodo],
    );
    return response.rows[0];
  }

  async update(id, { nome_metodo }) {
    const response = await database.query(
      `UPDATE metodo SET nome_metodo = $1 WHERE id_metodo = $2 RETURNING *`,
      [nome_metodo, id],
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM metodo WHERE id_metodo = $1",
      [id],
    );
    return response.rowCount > 0;
  }
}
