import database from "../../config/db.js";

export class CarteiraRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM carteira ORDER BY id_carteira DESC",
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      "SELECT * FROM carteira WHERE id_carteira = $1",
      [id],
    );
    return response.rows[0] || null;
  }

  async create({ id_usuario, nome_carteira }) {
    const response = await database.query(
      `INSERT INTO carteira (id_usuario, nome_carteira)
       VALUES ($1, $2)
       RETURNING *`,
      [id_usuario, nome_carteira],
    );
    return response.rows[0];
  }

  async update(id, { id_usuario, nome_carteira }) {
    const response = await database.query(
      `UPDATE carteira
       SET id_usuario = $1, nome_carteira = $2
       WHERE id_carteira = $3
       RETURNING *`,
      [id_usuario, nome_carteira, id],
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      "DELETE FROM carteira WHERE id_carteira = $1",
      [id],
    );
    return response.rowCount > 0;
  }

  async findByUsuario(id_usuario) {
    const response = await database.query(
      "SELECT * FROM carteira WHERE id_usuario = $1 ORDER BY id_carteira DESC",
      [id_usuario],
    );
    return response.rows;
  }
}
