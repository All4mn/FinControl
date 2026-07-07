// =============================================================================
// src/features/moeda/moeda.repository.js
// Acesso ao banco de dados para a tabela de moeda
// =============================================================================

import database from "../../config/db.js";

export class MoedaRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM moeda ORDER BY nome_moeda ASC"
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM moeda WHERE id_moeda = $1",
      [id]
    );
    return response.rows[0] || null;
  }

  async findByName(nome_moeda) {
    const response = await database.query(
      "SELECT * FROM moeda WHERE LOWER(nome_moeda) = LOWER($1) LIMIT 1",
      [nome_moeda]
    );
    return response.rows[0];
  }

  async hasConnections(id) {
    const response = await database.query(
      "SELECT 1 FROM conta WHERE id_moeda = $1 LIMIT 1",
      [id]
    );
    return response.rowCount > 0;
  }

  async create({ nome_moeda }) {
    const response = await database.query(
      `INSERT INTO moeda (nome_moeda) VALUES ($1) RETURNING *`,
      [nome_moeda]
    );
    return response.rows[0];
  }

  async update(id, nome_moeda ) {
    const response = await database.query(
      `UPDATE moeda SET nome_moeda = $1 WHERE id_moeda = $2 RETURNING *`,
      [nome_moeda, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM moeda WHERE id_moeda = $1",
      [id]
    );
    return response.rowCount > 0;
  }
}