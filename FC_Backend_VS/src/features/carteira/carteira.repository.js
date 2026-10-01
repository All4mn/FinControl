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

export class CarteiraRepository {
  async findAll(id_usuario) {
    return await this.findByUsuario(id_usuario);
  }

  async hasAtivoColumn() {
    // Verificação de metadados mantida em SQL bruto (via drizzle db.execute),
    // pois consulta o information_schema do PostgreSQL.
    const { rows } = await db.execute(sql`
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'carteira'
        AND column_name = 'ativo'
      LIMIT 1
    `);
    return rows.length > 0;
  }

  async findById(id) {
    const hasAtivo = await this.hasAtivoColumn();

    const rows = await db
      .select(hasAtivo ? { ...camposCarteira, ativo: carteira.ativo } : camposCarteira)
      .from(carteira)
      .leftJoin(conta, eq(conta.idUsuario, carteira.idUsuario))
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .where(eq(carteira.idCarteira, id))
      .groupBy(
        ...(hasAtivo ? [...gruposCarteira, carteira.ativo] : gruposCarteira),
      )
      .orderBy(asc(moeda.nomeMoeda));

    return rows;
  }

  async create({ id_usuario, nome_carteira }) {
    const rows = await db
      .insert(carteira)
      .values(
        semUndefined({
          idUsuario: id_usuario,
          nomeCarteira: nome_carteira,
        }),
      )
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
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

  async findByUsuario(id_usuario) {
    const hasAtivo = await this.hasAtivoColumn();

    const rows = await db
      .select(hasAtivo ? { ...camposCarteira, ativo: carteira.ativo } : camposCarteira)
      .from(carteira)
      .leftJoin(conta, eq(conta.idUsuario, carteira.idUsuario))
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .where(
        hasAtivo
          ? and(eq(carteira.idUsuario, id_usuario), eq(carteira.ativo, true))
          : eq(carteira.idUsuario, id_usuario),
      )
      .groupBy(
        ...(hasAtivo ? [...gruposCarteira, carteira.ativo] : gruposCarteira),
      )
      .orderBy(asc(moeda.nomeMoeda));

    return rows;
  }

  async findAllWithUsers() {
    const hasAtivo = await this.hasAtivoColumn();

    const campos = {
      id_carteira: carteira.idCarteira,
      id_usuario: carteira.idUsuario,
      nome_carteira: carteira.nomeCarteira,
      nome_usuario: usuario.nomeUsuario,
      email_usuario: usuario.emailUsuario,
      saldo_total: saldoTotal,
    };
    const grupos = [
      carteira.idCarteira,
      carteira.idUsuario,
      carteira.nomeCarteira,
      usuario.nomeUsuario,
      usuario.emailUsuario,
    ];
    if (hasAtivo) {
      campos.ativo = carteira.ativo;
      grupos.push(carteira.ativo);
    }

    const rows = await db
      .select(campos)
      .from(carteira)
      .leftJoin(conta, eq(conta.idUsuario, carteira.idUsuario))
      .innerJoin(usuario, eq(usuario.idUsuario, carteira.idUsuario))
      .groupBy(...grupos)
      .orderBy(desc(carteira.idCarteira));

    return rows;
  }

  async archiveByUsuario(id_usuario) {
    const hasAtivo = await this.hasAtivoColumn();
    if (!hasAtivo) {
      return [];
    }

    const rows = await db
      .update(carteira)
      .set({ ativo: false })
      .where(eq(carteira.idUsuario, id_usuario))
      .returning();
    return mapRows(rows);
  }
}
