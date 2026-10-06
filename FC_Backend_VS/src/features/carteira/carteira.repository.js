// =============================================================================
// src/features/carteira/carteira.repository.js
// Acesso ao banco de dados para a tabela de carteira (via Drizzle ORM)
// =============================================================================

import { eq, and, desc, asc, sql } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { carteira, conta, moeda, usuario } from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

// Remove campos undefined antes de insert/update,
// para não enviar "undefined" ao banco via Drizzle.
const semUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

// Soma dos saldos das contas do usuário, no mesmo formato do SQL anterior.
const saldoTotal = sql`COALESCE(SUM(${conta.saldoConta}), 0)::numeric(14,2)`;

// Campos projectionados nas consultas de carteira (alias em snake_case).
const camposCarteira = {
  id_carteira: carteira.idCarteira,
  id_usuario: carteira.idUsuario,
  nome_carteira: carteira.nomeCarteira,
  id_moeda: conta.idMoeda,
  nome_moeda: moeda.nomeMoeda,
  saldo_total: saldoTotal,
};

const gruposCarteira = [
  carteira.idCarteira,
  carteira.idUsuario,
  carteira.nomeCarteira,
  conta.idMoeda,
  moeda.nomeMoeda,
];

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
    const rows = await db
      .update(carteira)
      .set({ nomeCarteira: nome_carteira })
      .where(eq(carteira.idCarteira, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const rows = await db
      .delete(carteira)
      .where(eq(carteira.idCarteira, id))
      .returning({ id_carteira: carteira.idCarteira });
    return rows.length > 0;
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
