// =============================================================================
// models/contaModel.js
// Queries SQL para contas bancárias/carteiras
// =============================================================================

const { pool } = require('../config/database');

const ContaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM contas WHERE usuario_id = $1 ORDER BY criado_em DESC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      'SELECT * FROM contas WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, saldo_inicial = 0 }) {
    const { rows } = await pool.query(
      `INSERT INTO contas (usuario_id, nome, tipo, saldo_inicial, saldo_atual)
       VALUES ($1, $2, $3, $4, $4)
       RETURNING *`,
      [usuario_id, nome, tipo, saldo_inicial]
    );
    return rows[0];
  },

  async update(id, usuario_id, { nome, tipo }) {
    const { rows } = await pool.query(
      `UPDATE contas
       SET nome = $1, tipo = $2, atualizado_em = NOW()
       WHERE id = $3 AND usuario_id = $4
       RETURNING *`,
      [nome, tipo, id, usuario_id]
    );
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM contas WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },
};

module.exports = ContaModel;
