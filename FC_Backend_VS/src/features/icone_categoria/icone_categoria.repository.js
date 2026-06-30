import database from "../../config/db.js";

export class Icone_categoriaRepository {
  async findAll() {
    const response = await database.query(
      `SELECT * FROM icone_categoria ORDER BY id_icone_categoria DESC`
    );
    return response.rows;
  }

  async findById(id) {
    const response = await database.query(
      `SELECT * FROM icone_categoria WHERE id_icone_categoria = $1`,
      [id]
    );
    return response.rows[0] || null;
  }

  async create(dados) {
    const { nome_icone_categoria } = dados;
    const response = await database.query(
      `INSERT INTO icone_categoria (nome_icone_categoria) VALUES ($1) RETURNING *`,
      [nome_icone_categoria]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const { nome_icone_categoria } = dados;
    const response = await database.query(
      `UPDATE icone_categoria SET nome_icone_categoria = $1 WHERE id_icone_categoria = $2 RETURNING *`,
      [nome_icone_categoria, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query(
      `DELETE FROM icone_categoria WHERE id_icone_categoria = $1`,
      [id]
    );
    return response.rowCount > 0;
  }
}
