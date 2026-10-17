// =============================================================================
// models/repositories/metodo.repository.js
// Acesso ao banco de dados para a tabela de metodo (via Drizzle ORM)
// =============================================================================

import { eq, asc, sql } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { metodo } from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

const semUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export class MetodoRepository {
  async findAll() {
    const normalized = sql`lower(btrim(${metodo.nomeMetodo}))`;
    const rows = await db
      .select({
        id_metodo: metodo.idMetodo,
        nome_metodo: metodo.nomeMetodo,
      })
      .from(metodo)
      .orderBy(normalized, metodo.idMetodo);

    const uniqueMap = new Map();
    for (const r of rows) {
      const key = String(r.nome_metodo ?? "").trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, r);
      }
    }
    const unique = Array.from(uniqueMap.values()).sort((a, b) =>
      String(a.nome_metodo ?? "").localeCompare(String(b.nome_metodo ?? "")),
    );
    return unique;
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(metodo)
      .where(eq(metodo.idMetodo, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async create({ nome_metodo }) {
    const rows = await db
      .insert(metodo)
      .values({ nomeMetodo: nome_metodo })
      .returning({
        id_metodo: metodo.idMetodo,
        nome_metodo: metodo.nomeMetodo,
      });
    return rows[0] ?? null;
  }

  async update(id, { nome_metodo }) {
    const rows = await db
      .update(metodo)
      .set({ nomeMetodo: nome_metodo })
      .where(eq(metodo.idMetodo, id))
      .returning({
        id_metodo: metodo.idMetodo,
        nome_metodo: metodo.nomeMetodo,
      });
    return rows[0] ?? null;
  }

  async delete(id) {
    const rows = await db
      .delete(metodo)
      .where(eq(metodo.idMetodo, id))
      .returning({ id_metodo: metodo.idMetodo });
    return rows.length > 0;
  }
}