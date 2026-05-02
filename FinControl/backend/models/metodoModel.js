// =============================================================================
// models/metodoModel.js
// Queries SQL para métodos de pagamento
// =============================================================================

const { pool } = require('../config/database');

const MetodoModel = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM metodos ORDER BY nome ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM metodos WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nome, descricao }) {
    const { rows } = await pool.query(
      `INSERT INTO metodos (nome, descricao) VALUES ($1, $2) RETURNING *`,
      [nome, descricao]
    );
    return rows[0];
  },

  async update(id, { nome, descricao }) {
    const { rows } = await pool.query(
      `UPDATE metodos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *`,
      [nome, descricao, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM metodos WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = MetodoModel;
