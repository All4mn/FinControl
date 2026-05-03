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
      'SELECT id, nome, email, criado_em FROM usuarios ORDER BY criado_em DESC'
    );
    return rows;
  },

  /**
   * Busca usuário por ID.
   * @param {number} id
   */
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1',
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
      'SELECT * FROM usuarios WHERE email = $1',
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
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, criado_em`,
      [nome, email, senha_hash]
    );
    return rows[0];
  },

  /**
   * Atualiza dados de um usuário.
   * @param {number} id
   * @param {Object} dados - { nome, email }
   */
  async update(id, { nome, email }) {
    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nome = $1, email = $2, atualizado_em = NOW()
       WHERE id = $3
       RETURNING id, nome, email, atualizado_em`,
      [nome, email, id]
    );
    return rows[0] || null;
  },

  /**
   * Remove um usuário por ID.
   * @param {number} id
   */
  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = UsuarioModel;
