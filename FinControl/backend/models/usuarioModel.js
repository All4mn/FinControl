// =============================================================================
// models/usuarioModel.js
// Queries SQL para a tabela de usuários
// =============================================================================

const { pool } = require('../config/database');

const UsuarioModel = {
  /**
   * Busca todos os usuários (sem senha).
   */
  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, nome_usuario, email_usuario, criado_em FROM usuario ORDER BY criado_em DESC'
    );
    return rows;
  },

  /**
   * Busca usuário por ID.
   * @param {number} id
   */
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, nome_usuario, email_usuario, criado_em FROM usuario WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Busca usuário por e-mail (inclui senha para autenticação).
   * @param {string} email
   */
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM usuario WHERE email_usuario = $1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Cria um novo usuário.
   * @param {Object} dados - { nome, email, senha_hash }
   */
  async create({ nome, email, senha_hash }) {
    const { rows } = await pool.query(
      `INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario)
       VALUES ($1, $2, $3)
       RETURNING id, nome_usuario, email_usuario, criado_em`,
      [nome, email, senha_hash]
    );
    return rows[0];
  },

  /**
   * Atualiza dados de um usuário.
   * @param {number} id
   * @param {Object} dados - { nome, email }
   */
  async update(id, dados) {
    const fields = [];
    const values = [];
    let idx = 1;

    if ('nome' in dados && dados.nome) {
      fields.push(`nome_usuario = $${idx++}`);
      values.push(dados.nome);
    }
    if ('email' in dados && dados.email) {
      fields.push(`email_usuario = $${idx++}`);
      values.push(dados.email);
    }

    if (fields.length === 0) return null;

    fields.push(`atualizado_em = NOW()`);
    values.push(id);

    const query = `UPDATE usuario
                   SET ${fields.join(', ')}
                   WHERE id = $${idx}
                   RETURNING id, nome_usuario, email_usuario, atualizado_em`;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  },

  /**
   * Remove um usuário por ID.
   * @param {number} id
   */
  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM usuario WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = UsuarioModel;
