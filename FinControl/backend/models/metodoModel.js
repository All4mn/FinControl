// =============================================================================
// models/metodoModel.js
// Queries SQL para métodos de pagamento
// =============================================================================

const { pool } = require('../config/database');

const MetodoModel = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM metodo ORDER BY nome_metodo ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM metodo WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nome, descricao }) {
    const { rows } = await pool.query(
      `INSERT INTO metodo (nome_metodo, descricao_metodo) VALUES ($1, $2) RETURNING *`,
      [nome, descricao]
    );
    return rows[0];
  },

  async update(id, dados) {
    const fields = [];
    const values = [];
    let idx = 1;

    if ('nome' in dados && dados.nome) {
      fields.push(`nome_metodo = $${idx++}`);
      values.push(dados.nome);
    }
    if ('descricao' in dados) {
      fields.push(`descricao_metodo = $${idx++}`);
      values.push(dados.descricao);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE metodo
                   SET ${fields.join(', ')}
                   WHERE id = $${idx}
                   RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM metodo WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = MetodoModel;
