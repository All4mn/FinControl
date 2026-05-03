// =============================================================================
// models/transacaoModel.js
// Queries SQL para transações financeiras
// =============================================================================

const { pool } = require('../config/database');

const TransacaoModel = {
  async findAll(usuario_id, filtros = {}) {
    let query = `
      SELECT t.*, c.nome AS categoria_nome, m.nome AS metodo_nome
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      LEFT JOIN metodos m ON t.metodo_id = m.id
      WHERE t.usuario_id = $1
    `;
    const params = [usuario_id];
    let idx = 2;

    if (filtros.tipo) {
      query += ` AND t.tipo = $${idx++}`;
      params.push(filtros.tipo);
    }
    if (filtros.conta_id) {
      query += ` AND t.conta_id = $${idx++}`;
      params.push(filtros.conta_id);
    }
    if (filtros.data_inicio) {
      query += ` AND t.data >= $${idx++}`;
      params.push(filtros.data_inicio);
    }
    if (filtros.data_fim) {
      query += ` AND t.data <= $${idx++}`;
      params.push(filtros.data_fim);
    }

    query += ' ORDER BY t.data DESC, t.criado_em DESC';

    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      `SELECT t.*, c.nome AS categoria_nome, m.nome AS metodo_nome
       FROM transacoes t
       LEFT JOIN categorias c ON t.categoria_id = c.id
       LEFT JOIN metodos m ON t.metodo_id = m.id
       WHERE t.id = $1 AND t.usuario_id = $2`,
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data }) {
    const { rows } = await pool.query(
      `INSERT INTO transacoes (usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data]
    );
    return rows[0];
  },

  async update(id, usuario_id, dados) {
    const { descricao, valor, data, categoria_id, metodo_id, tipo } = dados;
    const { rows } = await pool.query(
      `UPDATE transacoes
       SET descricao = $1, valor = $2, data = $3,
           categoria_id = $4, metodo_id = $5, tipo = $6,
           atualizado_em = NOW()
       WHERE id = $7 AND usuario_id = $8
       RETURNING *`,
      [descricao, valor, data, categoria_id, metodo_id, tipo, id, usuario_id]
    );
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },

  async resumo(usuario_id) {
    const { rows } = await pool.query(
      `SELECT
         SUM(CASE WHEN tipo = 'receita'  THEN valor ELSE 0 END) AS total_receitas,
         SUM(CASE WHEN tipo = 'despesa'  THEN valor ELSE 0 END) AS total_despesas,
         COUNT(*) AS total_transacoes
       FROM transacoes
       WHERE usuario_id = $1`,
      [usuario_id]
    );
    return rows[0];
  },
};

module.exports = TransacaoModel;
