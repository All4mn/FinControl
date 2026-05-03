// =============================================================================
// models/categoriaModel.js
// Queries SQL para categorias de transações
// =============================================================================

const { pool } = require('../config/database');

const CategoriaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM categorias
       WHERE usuario_id = $1 OR usuario_id IS NULL
       ORDER BY nome ASC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM categorias WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, cor, icone }) {
    const { rows } = await pool.query(
      `INSERT INTO categorias (usuario_id, nome, tipo, cor, icone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuario_id, nome, tipo, cor || '#6366f1', icone || '📦']
    );
    return rows[0];
  },

  async update(id, { nome, tipo, cor, icone }) {
    const { rows } = await pool.query(
      `UPDATE categorias
       SET nome = $1, tipo = $2, cor = $3, icone = $4
       WHERE id = $5
       RETURNING *`,
      [nome, tipo, cor, icone, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM categorias WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = CategoriaModel;
