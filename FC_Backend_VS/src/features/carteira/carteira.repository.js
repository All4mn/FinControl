import database from "../../config/db.js";

// DÍVIDA CONHECIDA: o saldo soma por id_usuario, não por carteira_has_conta
// como manda Documentacao-Carteira.md, porque hoje isso somaria saldo de outra
// pessoa. carteira_has_conta cobre 10 das 29 contas (6 de 14 usuários) e a
// conta do usuário 1 (R$ 1500,50) está vinculada à carteira do usuário 16.
// Antes de migrar: preencher os vínculos e definir a semântica de contas
// compartilhadas/carteiras múltiplas.
export class CarteiraRepository {
  async findAll(id_usuario) {
    return await this.findByUsuario(id_usuario);
  }

  async findById(id) {
    const response = await database.query(
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              ct.id_moeda,
              m.nome_moeda,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total,
              c.ativo
         FROM carteira c
         LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario AND ct.ativo = TRUE
         LEFT JOIN moeda m ON m.id_moeda = ct.id_moeda
        WHERE c.id_carteira = $1
        GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira, ct.id_moeda, m.nome_moeda, c.ativo
        ORDER BY m.nome_moeda`,
      [id],
    );
    return response.rows;
  }

  // 'client' opcional: roda dentro da transação de conta.service.create.
  async create({ id_usuario, nome_carteira }, client = null) {
    const executor = client || database;
    const response = await executor.query(
      `INSERT INTO carteira (id_usuario, nome_carteira, ativo)
       VALUES ($1, $2, TRUE)
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

  // 'client' opcional: roda dentro da transação de conta.service.create.
  async findByUsuario(id_usuario, client = null) {
    const executor = client || database;
    const response = await executor.query(
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              ct.id_moeda,
              m.nome_moeda,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total,
              c.ativo
         FROM carteira c
         LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario AND ct.ativo = TRUE
         LEFT JOIN moeda m ON m.id_moeda = ct.id_moeda
        WHERE c.id_usuario = $1 AND c.ativo = TRUE
        GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira, ct.id_moeda, m.nome_moeda, c.ativo
        ORDER BY m.nome_moeda`,
      [id_usuario],
    );
    return response.rows;
  }

  async findAllWithUsers() {
    const response = await database.query(
      `SELECT c.id_carteira,
              c.id_usuario,
              c.nome_carteira,
              c.ativo,
              u.nome_usuario,
              u.email_usuario,
              COALESCE(SUM(ct.saldo_conta), 0)::numeric(14,2) AS saldo_total
         FROM carteira c
         LEFT JOIN conta ct ON ct.id_usuario = c.id_usuario AND ct.ativo = TRUE
         INNER JOIN usuario u ON u.id_usuario = c.id_usuario
        GROUP BY c.id_carteira, c.id_usuario, c.nome_carteira, c.ativo, u.nome_usuario, u.email_usuario
        ORDER BY c.id_carteira DESC`,
    );
    return response.rows;
  }

  async archiveByUsuario(id_usuario) {
    const response = await database.query(
      `UPDATE carteira
       SET ativo = FALSE
       WHERE id_usuario = $1
       RETURNING *`,
      [id_usuario],
    );
    return response.rows;
  }
}
