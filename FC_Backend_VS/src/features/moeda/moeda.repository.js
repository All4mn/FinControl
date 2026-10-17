// =============================================================================
// src/features/moeda/moeda.repository.js
// Acesso ao banco de dados para a tabela de moeda (via Drizzle ORM)
// =============================================================================

import { eq, asc, sql } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { moeda, conta } from "../../db/schema.js";

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

export class MoedaRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(moeda)
      .orderBy(asc(moeda.nomeMoeda));
    return mapRows(rows);
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(moeda)
      .where(eq(moeda.idMoeda, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findByName(nome_moeda) {
    const rows = await db
      .select()
      .from(moeda)
      .where(
        sql`LOWER(${moeda.nomeMoeda}) = LOWER(${nome_moeda})`,
      )
      .limit(1);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async hasConnections(id) {
    const rows = await db
      .select({ id_conta: conta.idConta })
      .from(conta)
      .where(eq(conta.idMoeda, id))
      .limit(1);
    return rows.length > 0;
  }

  async create({ nome_moeda }) {
    const rows = await db
      .insert(moeda)
      .values(semUndefined({ nomeMoeda: nome_moeda }))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async update(id, nome_moeda) {
    const rows = await db
      .update(moeda)
      .set({ nomeMoeda: nome_moeda })
      .where(eq(moeda.idMoeda, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const rows = await db
      .delete(moeda)
      .where(eq(moeda.idMoeda, id))
      .returning({ id_moeda: moeda.idMoeda });
    return rows.length > 0;
  }
}
