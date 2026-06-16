import database from "../../config/db.js";

export class StatusUsuarioRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM status_usuario ORDER BY nome_status ASC"
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM status_usuario WHERE id_status = $1",
      [id]
    );
    return response.rows[0] || null;
  }

  async create({ nome_status }) {
    const response = await database.query(
      "INSERT INTO status_usuario (nome_status) VALUES ($1) RETURNING *",
      [nome_status]
    );
    return response.rows[0];
  }

  async update(id, { nome_status }) {
    const response = await database.query(
      "UPDATE status_usuario SET nome_status = $1 WHERE id_status = $2 RETURNING *",
      [nome_status, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM status_usuario WHERE id_status = $1",
      [id]
    );
    return response.rowCount > 0;
  }
}