import database from "../../config/db.js";

export class CarteiraRepository {
  async findAll(id_usuario) {
    return await this.findByUsuario(id_usuario);
  }

  async findById(id) {
    const response = await database.query(
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total
       FROM carteira c
       LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario
       WHERE c.id_carteira = $1
       GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira`,
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
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total
       FROM carteira c
       LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario
       WHERE c.id_usuario = $1
       GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira
       ORDER BY c.id_carteira DESC
       LIMIT 1`,
      [id_usuario],
    );
    return response.rows[0] || null;
  }

  async findAllWithUsers() {
    const response = await database.query(
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              u.nome_usuario,
              u.email_usuario,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total
       FROM carteira c
       LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario
       INNER JOIN usuario u ON u.id_usuario = c.id_usuario
       GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira, u.nome_usuario, u.email_usuario
       ORDER BY c.id_carteira DESC`,
    );
    return response.rows;
  }
}
