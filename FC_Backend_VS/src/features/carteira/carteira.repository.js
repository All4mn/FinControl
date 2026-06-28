import database from "../../config/db.js";

export class CarteiraRepository {
  async findAll(id_usuario) {
    return await this.findByUsuario(id_usuario);
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

  async update(id, { nome_carteira }) {
    const response = await database.query(
      `UPDATE carteira
       SET nome_carteira = $1
       WHERE id_carteira = $2
       RETURNING *`,
      [nome_carteira, id],
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
