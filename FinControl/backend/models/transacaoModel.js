// =============================================================================
// models/transacaoModel.js
// Queries SQL para transações financeiras
// =============================================================================

const { pool } = require('../config/database');

const TransacaoModel = {
  async findAll(usuario_id, filtros = {}) {
    let query = `
      SELECT t.*, c.nome_categoria AS categoria_nome, m.nome_metodo AS metodo_nome
      FROM transacao t
      LEFT JOIN categoria c ON t.id_categoria = c.id
      LEFT JOIN metodo m ON t.id_metodo = m.id
      WHERE t.id_usuario = $1
    `;
    const params = [usuario_id];
    let idx = 2;

    if (filtros.tipo) {
      query += ` AND t.tipo_transacao = $${idx++}`;
      params.push(filtros.tipo);
    }
    if (filtros.conta_id) {
      query += ` AND t.id_conta = $${idx++}`;
      params.push(filtros.conta_id);
    }
    if (filtros.data_inicio) {
      query += ` AND t.data_transacao >= $${idx++}`;
      params.push(filtros.data_inicio);
    }
    if (filtros.data_fim) {
      query += ` AND t.data_transacao <= $${idx++}`;
      params.push(filtros.data_fim);
    }

    query += ' ORDER BY t.data_transacao DESC, t.criado_em DESC';

    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      `SELECT t.*, c.nome_categoria AS categoria_nome, m.nome_metodo AS metodo_nome
       FROM transacao t
       LEFT JOIN categoria c ON t.id_categoria = c.id
       LEFT JOIN metodo m ON t.id_metodo = m.id
       WHERE t.id = $1 AND t.id_usuario = $2`,
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data }) {
    const { rows } = await pool.query(
      `INSERT INTO transacao (id_usuario, id_conta, id_categoria, id_metodo, tipo_transacao, descricao_transacao, valor_transacao, data_transacao)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data]
    );
    return rows[0];
  },

  async update(id, usuario_id, dados) {
    const fields = [];
    const values = [];
    let idx = 1;

    // Apenas campos que foram fornecidos
    if ('descricao' in dados) {
      fields.push(`descricao_transacao = $${idx++}`);
      values.push(dados.descricao);
    }
    if ('valor' in dados) {
      fields.push(`valor_transacao = $${idx++}`);
      values.push(dados.valor);
    }
    if ('data' in dados) {
      fields.push(`data_transacao = $${idx++}`);
      values.push(dados.data);
    }
    if ('categoria_id' in dados) {
      fields.push(`id_categoria = $${idx++}`);
      values.push(dados.categoria_id);
    }
    if ('metodo_id' in dados) {
      fields.push(`id_metodo = $${idx++}`);
      values.push(dados.metodo_id);
    }
    if ('tipo' in dados) {
      fields.push(`tipo_transacao = $${idx++}`);
      values.push(dados.tipo);
    }

    if (fields.length === 0) return null;

    fields.push(`atualizado_em = NOW()`);
    values.push(id, usuario_id);

    const query = `UPDATE transacoes
                   SET ${fields.join(', ')}
                   WHERE id = $${idx++} AND id_usuario = $${idx}
                   RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM transacao WHERE id = $1 AND id_usuario = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },

  async resumo(usuario_id) {
    const { rows } = await pool.query(
      `SELECT
         SUM(CASE WHEN tipo_transacao = 'receita'  THEN valor_transacao ELSE 0 END) AS total_receitas,
         SUM(CASE WHEN tipo_transacao = 'despesa'  THEN valor_transacao ELSE 0 END) AS total_despesas,
         COUNT(*) AS total_transacoes
       FROM transacao
       WHERE id_usuario = $1`,
      [usuario_id]
    );
    return rows[0];
  },
};

module.exports = TransacaoModel;
