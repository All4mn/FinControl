// =============================================================================
// src/features/carteira/carteira.repository.js
// Acesso ao banco de dados para a tabela de carteira (via Drizzle ORM)
// =============================================================================

import { eq, and, desc, sql } from "drizzle-orm";
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
  ativo: carteira.ativo,
};

const gruposCarteira = [
  carteira.idCarteira,
  carteira.idUsuario,
  carteira.nomeCarteira,
  conta.idMoeda,
  moeda.nomeMoeda,
  carteira.ativo,
];

const joinCarteiraConta = and(
  eq(conta.idUsuario, carteira.idUsuario),
  sql`${conta.ativo} = TRUE`,
);

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
    const rows = await db
      .select(camposCarteira)
      .from(carteira)
      .leftJoin(conta, joinCarteiraConta)
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .where(eq(carteira.idCarteira, id))
      .groupBy(...gruposCarteira)
      .orderBy(moeda.nomeMoeda);
    return rows;
  }

  // 'tx' opcional: roda dentro da transação de conta.service.create.
  async create({ id_usuario, nome_carteira }, tx = null) {
    const executor = tx || db;
    const rows = await executor
      .insert(carteira)
      .values({
        idUsuario: id_usuario,
        nomeCarteira: nome_carteira,
        ativo: true,
      })
      .returning();
    return mapRow(rows[0]);
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

  // 'tx' opcional: roda dentro da transação de conta.service.create.
  async findByUsuario(id_usuario, tx = null) {
    const executor = tx || db;
    const rows = await executor
      .select(camposCarteira)
      .from(carteira)
      .leftJoin(conta, joinCarteiraConta)
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .where(
        and(
          eq(carteira.idUsuario, id_usuario),
          sql`${carteira.ativo} = TRUE`,
        ),
      )
      .groupBy(...gruposCarteira)
      .orderBy(moeda.nomeMoeda);
    return rows;
  }

  async findAllWithUsers() {
    const rows = await db
      .select({
        id_carteira: carteira.idCarteira,
        id_usuario: carteira.idUsuario,
        nome_carteira: carteira.nomeCarteira,
        ativo: carteira.ativo,
        nome_usuario: usuario.nomeUsuario,
        email_usuario: usuario.emailUsuario,
        saldo_total: saldoTotal,
      })
      .from(carteira)
      .leftJoin(conta, joinCarteiraConta)
      .innerJoin(usuario, eq(usuario.idUsuario, carteira.idUsuario))
      .groupBy(
        carteira.idCarteira,
        carteira.idUsuario,
        carteira.nomeCarteira,
        carteira.ativo,
        usuario.nomeUsuario,
        usuario.emailUsuario,
      )
      .orderBy(desc(carteira.idCarteira));
    return rows;
  }

  async archiveByUsuario(id_usuario) {
    const rows = await db
      .update(carteira)
      .set({ ativo: false })
      .where(eq(carteira.idUsuario, id_usuario))
      .returning();
    return mapRows(rows);
  }
}
