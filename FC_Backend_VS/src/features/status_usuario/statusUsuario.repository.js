import { eq, asc, count } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { statusUsuario, usuario } from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

export class StatusUsuarioRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(statusUsuario)
      .orderBy(asc(statusUsuario.nomeStatusUsuario));
    return mapRows(rows);
  }

  async countUsersByStatusId(id) {
    const rows = await db
      .select({ total: count() })
      .from(usuario)
      .where(eq(usuario.idStatusUsuario, id));
    return Number(rows[0]?.total ?? 0);
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(statusUsuario)
      .where(eq(statusUsuario.idStatusUsuario, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async create({ id_status_usuario, nome_status_usuario }) {
    const rows = await db
      .insert(statusUsuario)
      .values({
        idStatusUsuario: id_status_usuario,
        nomeStatusUsuario: nome_status_usuario,
      })
      .returning({
        id_status_usuario: statusUsuario.idStatusUsuario,
        nome_status_usuario: statusUsuario.nomeStatusUsuario,
      });
    return rows[0];
  }

  async update(id, { nome_status_usuario }) {
    const rows = await db
      .update(statusUsuario)
      .set({ nomeStatusUsuario: nome_status_usuario })
      .where(eq(statusUsuario.idStatusUsuario, id))
      .returning({
        id_status_usuario: statusUsuario.idStatusUsuario,
        nome_status_usuario: statusUsuario.nomeStatusUsuario,
      });
    return rows[0] ?? null;
  }

  async delete(id) {
    const rows = await db
      .delete(statusUsuario)
      .where(eq(statusUsuario.idStatusUsuario, id))
      .returning({ id_status_usuario: statusUsuario.idStatusUsuario });
    return rows.length > 0;
  }
}