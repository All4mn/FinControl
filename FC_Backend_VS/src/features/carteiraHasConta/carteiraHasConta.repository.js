import database from "../../config/db.js";

export class CarteiraHasContaRepository {
  async findAll() {
    const response = await database.query(
      // `SELECT * FROM carteiraHasConta ORDER BY id_carteiraHasConta DESC`
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
      FROM carteiraHasConta t
      INNER JOIN carteira c ON c.id_carteira = t.id_carteira, conta a ON a.id_conta = t.id_conta, usuario u ON u.id_usuario = a.id_usuario, moeda m ON m.id_moeda = a.id_moeda
      ORDER BY t.id_carteira_has_conta DESC
    `
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      `SELECT * FROM carteiraHasConta WHERE id_carteiraHasConta = $1`,
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
    const { nome_carteiraHasConta } = dados;
    const response = await database.query(
      `INSERT INTO carteiraHasConta (id_carteira, id_conta) VALUES ($1, $2) RETURNING *`,
      [dados.id_carteira, dados.id_conta]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const { nome_carteiraHasConta } = dados;
    const response = await database.query(
      `UPDATE carteiraHasConta SET nome_carteiraHasConta = $1 WHERE id_carteiraHasConta = $2 RETURNING *`,
      [nome_carteiraHasConta, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      `DELETE FROM carteiraHasConta WHERE id_carteiraHasConta = $1`,
      [id]
    );
    return response.rowCount > 0;
  }
}
