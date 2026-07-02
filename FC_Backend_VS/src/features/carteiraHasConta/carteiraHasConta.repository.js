import database from "../../config/db.js";

export class CarteiraHasContaRepository {
  async findAll() {
    const response = await database.query(
      `
      SELECT
        t.id_carteira_has_conta,
        t.id_carteira,
        t.id_conta,
        c.nome_carteira,
        a.nome_conta,
        u.nome_usuario,
        a.saldo_conta,
        m.nome_moeda
      FROM carteira_has_conta t
      INNER JOIN carteira c ON c.id_carteira = t.id_carteira
      INNER JOIN conta a ON a.id_conta = t.id_conta
      INNER JOIN usuario u ON u.id_usuario = c.id_usuario
      INNER JOIN moeda m ON m.id_moeda = a.id_moeda
      ORDER BY t.id_carteira_has_conta DESC
    `
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      `SELECT * FROM carteira_has_conta WHERE id_carteira_has_conta = $1`,
      [id]
    );
    return response.rows[0] || null;
  }

  async verifyIdCarteiraExistence(id) {
    const response = await database.query(
      `SELECT * FROM carteira WHERE id_carteira = $1`,
      [id]
    );
    return response.rows[0] || null;
  }

  async verifyIdContaExistence(id) {
    const response = await database.query(
      `SELECT * FROM conta WHERE id_conta = $1`,
      [id]
    );
    return response.rows[0] || null;
  }

  async create(dados) {
    const response = await database.query(
      `INSERT INTO carteira_has_conta (id_carteira, id_conta) VALUES ($1, $2) RETURNING *`,
      [dados.id_carteira, dados.id_conta]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const response = await database.query(
      `UPDATE carteira_has_conta SET id_carteira = $1, id_conta = $2 WHERE id_carteira_has_conta = $3 RETURNING *`,
      [dados.id_carteira, dados.id_conta, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      `DELETE FROM carteira_has_conta WHERE id_carteira_has_conta = $1`,
      [id]
    );
    return response.rowCount > 0;
  }
}
