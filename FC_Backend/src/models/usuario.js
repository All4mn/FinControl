// =============================================================================
// models/usuario.js
// Queries SQL para a tabela de usuario
// =============================================================================

import database from "../config/db.js";

class UsuarioModel {
  /**
   * Busca todos os usuários (sem a senha, por segurança).
   */
  async findAll() {
    const response = await database.query(
      // 'SELECT id_usuario, nome_usuario, email_usuario, telefone_usuario, google_id_usuario FROM usuario ORDER BY id_usuario DESC'
      'SELECT * FROM usuario ORDER BY id_usuario DESC'
    );
    return response.rows;
  }
   async findByLogin({ email_usuario, senha_usuario }) {
    const response = await database.query(
      'SELECT id_usuario, nome_usuario, email_usuario, telefone_usuario FROM usuario WHERE email_usuario = $1 AND senha_usuario = $2',
      [email_usuario, senha_usuario]
    )
    return response.rows[0] || null;
   }
  /**
   * Busca usuário por ID.
   */
  async findById(id) {
    const response = await database.query(
      'SELECT id_usuario, nome_usuario, email_usuario, telefone_usuario, google_id_usuario FROM usuario WHERE id_usuario = $1',
      [id]
    );
    return response.rows[0] || null;
  }

  /**
   * Busca usuário pelo ID do Google.
   */
  async findByGoogleId(googleId) {
    console.log("Buscando usuário por Google ID:", googleId);
    const response = await database.query(
      'SELECT id_usuario, nome_usuario, email_usuario, telefone_usuario, google_id_usuario FROM usuario WHERE google_id_usuario = $1',
      [googleId]
    );
    return response.rows[0] || null;
  }

  /**
   * Cria um novo usuário.
   */
  async create({ nome_usuario, email_usuario, senha_usuario, telefone_usuario }) {
    const response = await database.query(
      `INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, telefone_usuario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nome_usuario, email_usuario, telefone_usuario`,
      [nome_usuario, email_usuario, senha_usuario, telefone_usuario],
    );
    return response.rows[0];
  }

  async buscarPorEmail(email) {
    const response = await database.query(
      "SELECT id_usuario, nome_usuario, email_usuario, senha_usuario FROM usuario WHERE email_usuario = $1",
      [email],
    );
    return response.rows[0] || null;
  }

  /**
   * Cria um novo usuário com dados do Google.
   */
  async createWithGoogle({ google_id, nome_usuario, email_usuario, telefone_usuario = null }) {
    const response = await database.query(
      `INSERT INTO usuario (nome_usuario, email_usuario, telefone_usuario, google_id_usuario)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nome_usuario, email_usuario, telefone_usuario, google_id_usuario`,
      [nome_usuario, email_usuario, telefone_usuario, google_id]
    );
    return response.rows[0];
  }

  /**
   * Atualiza dados de um usuário.
   */
  async update(
    id,
    { nome_usuario, email_usuario, senha_usuario, telefone_usuario },
  ) {
    const response = await database.query(
      `UPDATE usuario
       SET nome_usuario = $1, email_usuario = $2, senha_usuario = $3, telefone_usuario = $4
       WHERE id_usuario = $5
       RETURNING id_usuario, nome_usuario, email_usuario, telefone_usuario`,
      [nome_usuario, email_usuario, senha_usuario, telefone_usuario, id],
    );
    return response.rows[0] || null;
  }

  /**
   * Remove um usuário por ID.
   */
  async delete(id) {
    const response = await database.query(
      "DELETE FROM usuario WHERE id_usuario = $1",
      [id],
    );
    return response.rowCount > 0;
  }
}

export default new UsuarioModel();
