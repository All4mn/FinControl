// =============================================================================
// models/repositories/categoria.repository.js
// Acesso ao banco de dados para a tabela de categoria (via Drizzle ORM)
// =============================================================================

import { eq, asc } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { categoria } from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

export class CategoriaRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(categoria)
      .orderBy(asc(categoria.nomeCategoria));
    return mapRows(rows);
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(categoria)
      .where(eq(categoria.idCategoria, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async create({ nome_categoria }) {
    const rows = await db
      .insert(categoria)
      .values({ nomeCategoria: nome_categoria })
      .returning({
        id_categoria: categoria.idCategoria,
        nome_categoria: categoria.nomeCategoria,
      });
    return rows[0] ?? null;
  }

  async update(id, { nome_categoria }) {
    const rows = await db
      .update(categoria)
      .set({ nomeCategoria: nome_categoria })
      .where(eq(categoria.idCategoria, id))
      .returning({
        id_categoria: categoria.idCategoria,
        nome_categoria: categoria.nomeCategoria,
      });
    return rows[0] ?? null;
  }

  async delete(id) {
    const rows = await db
      .delete(categoria)
      .where(eq(categoria.idCategoria, id))
      .returning({ id_categoria: categoria.idCategoria });
    return rows.length > 0;
  }
}