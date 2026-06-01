// =============================================================================
// models/categoria.js
// Queries SQL para a tabela de categoria
// =============================================================================

import database from '../config/db.js';

class CategoriaModel {
  async findAll() {
    const response = await database.query('SELECT * FROM categoria ORDER BY nome_categoria ASC');
    return response.rows;
  }

  async findById(id) {
    const response = await database.query('SELECT * FROM categoria WHERE id_categoria = $1', [id]);
    return response.rows[0] || null;
  }

  async create({ nome_categoria }) {
    const response = await database.query(
      `INSERT INTO categoria (nome_categoria) VALUES ($1) RETURNING *`,
      [nome_categoria]
    );
    return response.rows[0];
  }

  async update(id, { nome_categoria }) {
    const response = await database.query(
      `UPDATE categoria SET nome_categoria = $1 WHERE id_categoria = $2 RETURNING *`,
      [nome_categoria, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query('DELETE FROM categoria WHERE id_categoria = $1', [id]);
    return response.rowCount > 0;
  }
}

export default new CategoriaModel();