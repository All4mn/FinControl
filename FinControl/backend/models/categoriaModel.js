// =============================================================================
// models/categoriaModel.js
// Queries SQL para categorias de transações
// =============================================================================

const { pool } = require('../config/database');

const CategoriaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM categoria
       WHERE id_usuario = $1 OR id_usuario IS NULL
       ORDER BY nome_categoria ASC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM categoria WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, cor, icone }) {
    const { rows } = await pool.query(
      `INSERT INTO categoria (id_usuario, nome_categoria, tipo, cor, icone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuario_id, nome, tipo, cor || '#6366f1', icone || '📦']
    );
    return rows[0];
  },

  async update(id, dados) {
    const fields = [];
    const values = [];
    let idx = 1;

    if ('nome' in dados) {
      fields.push(`nome_categoria = $${idx++}`);
      values.push(dados.nome);
    }
    if ('tipo' in dados) {
      fields.push(`tipo = $${idx++}`);
      values.push(dados.tipo);
    }
    if ('cor' in dados) {
      fields.push(`cor = $${idx++}`);
      values.push(dados.cor);
    }
    if ('icone' in dados) {
      fields.push(`icone = $${idx++}`);
      values.push(dados.icone);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `UPDATE categoria
                   SET ${fields.join(', ')}
                   WHERE id = $${idx}
                   RETURNING *`;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM categoria WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = CategoriaModel;
