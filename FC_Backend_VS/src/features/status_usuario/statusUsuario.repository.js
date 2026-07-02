import database from "../../config/db.js";

export class StatusUsuarioRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM status_usuario ORDER BY nome_status_usuario ASC"
    );
    return response.rows;
  }

  async countUsersByStatusId(id) {
    const response = await database.query(
      "SELECT COUNT(*)::int AS total FROM usuario WHERE id_status_usuario = $1",
      [id]
    );
    return response.rows[0]?.total ?? 0;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM status_usuario WHERE id_status_usuario = $1",
      [id]
    );
    return response.rows[0] || null;
  }

  async create({ nome_status_usuario }) {
    const response = await database.query(
      "INSERT INTO status_usuario (nome_status_usuario) VALUES ($1) RETURNING *",
      [nome_status_usuario]
    );
    return response.rows[0];
  }

  async update(id, { nome_status_usuario }) {
    const response = await database.query(
      "UPDATE status_usuario SET nome_status_usuario = $1 WHERE id_status_usuario = $2 RETURNING *",
      [nome_status_usuario, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM status_usuario WHERE id_status_usuario = $1",
      [id]
    );
    return response.rowCount > 0;
  }
}