// =============================================================================
// models/contaModel.js
// Queries SQL para contas bancárias/carteiras
// =============================================================================

const { pool } = require('../config/database');

const ContaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM conta WHERE id_usuario = $1 ORDER BY criado_em DESC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      'SELECT * FROM conta WHERE id = $1 AND id_usuario = $2',
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, saldo_inicial = 0 }) {
    const { rows } = await pool.query(
      `INSERT INTO conta (id_usuario, name_conta, tipo, saldo_conta)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [usuario_id, nome, tipo, saldo_inicial]
    );
    return rows[0];
  },

  async update(id, usuario_id, dados) {
    const fields = [];
    const values = [];
    let idx = 1;

    if ('nome' in dados && dados.nome) {
      fields.push(`name_conta = $${idx++}`);
      values.push(dados.nome);
    }
    if ('tipo' in dados && dados.tipo) {
      fields.push(`tipo = $${idx++}`);
      values.push(dados.tipo);
    }

    if (fields.length === 0) return null;

    fields.push(`atualizado_em = NOW()`);
    values.push(id, usuario_id);

    const query = `UPDATE conta
                   SET ${fields.join(', ')}
                   WHERE id = $${idx++} AND id_usuario = $${idx}
                   RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM conta WHERE id = $1 AND id_usuario = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },
};

module.exports = ContaModel;
