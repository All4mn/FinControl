// =============================================================================
// models/repositories/usuario.repository.js
// Acesso ao banco de dados para a tabela de usuario (via Drizzle ORM)
// =============================================================================

import { eq, and, desc } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { usuario } from "../../db/schema.js";

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

// Campos seguros para retorno (nunca incluir senha_usuario/is_admin
// nestas projeções, pois o resultado é devolvido direto na resposta HTTP).
const camposPublicos = {
  id_usuario: usuario.idUsuario,
  nome_usuario: usuario.nomeUsuario,
  email_usuario: usuario.emailUsuario,
  telefone_usuario: usuario.telefoneUsuario,
};

export class UsuarioRepository {
  /**
   * Busca todos os usuários.
   */
  async findAll() {
    const rows = await db
      .select()
      .from(usuario)
      .orderBy(desc(usuario.idUsuario));
    return mapRows(rows);
  }

  async findByLogin({ email_usuario, senha_usuario }) {
    const rows = await db
      .select(camposPublicos)
      .from(usuario)
      .where(
        and(
          eq(usuario.emailUsuario, email_usuario),
          eq(usuario.senhaUsuario, senha_usuario),
          eq(usuario.idStatusUsuario, 1),
        ),
      );

    return rows[0] ?? null;
  }

  /**
   * Busca usuário por ID.
   */
  async findById(id) {
    const rows = await db
      .select()
      .from(usuario)
      .where(eq(usuario.idUsuario, id));

    return rows[0] ? mapRow(rows[0]) : null;
  }

  /**
   * Busca usuário pelo ID do Google.
   */
  async findByGoogleId(googleId) {
    const rows = await db
      .select({
        ...camposPublicos,
        google_id_usuario: usuario.googleIdUsuario,
      })
      .from(usuario)
      .where(eq(usuario.googleIdUsuario, googleId));

    return rows[0] ?? null;
  }

  /**
   * Cria um novo usuário.
   */
  async create({ nome_usuario, email_usuario, senha_usuario, telefone_usuario }) {
    const rows = await db
      .insert(usuario)
      .values(
        semUndefined({
          nomeUsuario: nome_usuario,
          emailUsuario: email_usuario,
          senhaUsuario: senha_usuario,
          telefoneUsuario: telefone_usuario,
          idStatusUsuario: 1,
        }),
      )
      .returning(camposPublicos);

    return rows[0] ?? null;
  }

  async buscarPorEmail(email) {
    const rows = await db
      .select({
        id_usuario: usuario.idUsuario,
        nome_usuario: usuario.nomeUsuario,
        email_usuario: usuario.emailUsuario,
        senha_usuario: usuario.senhaUsuario,
      })
      .from(usuario)
      .where(eq(usuario.emailUsuario, email));

    return rows[0] ?? null;
  }

  /**
   * Cria um novo usuário com dados do Google.
   */
  async createWithGoogle({
    google_id,
    nome_usuario,
    email_usuario,
    telefone_usuario = null,
  }) {
    const rows = await db
      .insert(usuario)
      .values(
        semUndefined({
          nomeUsuario: nome_usuario,
          emailUsuario: email_usuario,
          telefoneUsuario: telefone_usuario,
          googleIdUsuario: google_id,
          idStatusUsuario: 1,
        }),
      )
      .returning({
        ...camposPublicos,
        google_id_usuario: usuario.googleIdUsuario,
      });

    return rows[0] ?? null;
  }

  /**
   * Atualiza dados de um usuário.
   */
  async update(
    id,
    { nome_usuario, email_usuario, senha_usuario, telefone_usuario },
  ) {
    const rows = await db
      .update(usuario)
      .set(
        semUndefined({
          nomeUsuario: nome_usuario,
          emailUsuario: email_usuario,
          senhaUsuario: senha_usuario,
          telefoneUsuario: telefone_usuario,
        }),
      )
      .where(eq(usuario.idUsuario, id))
      .returning(camposPublicos);

    return rows[0] ?? null;
  }

  /**
   * Remove um usuário por ID.
   */
  async delete(id) {
    const rows = await db
      .delete(usuario)
      .where(eq(usuario.idUsuario, id))
      .returning({ id_usuario: usuario.idUsuario });

    return rows.length > 0;
  }

  /**
   * Ativa ou desativa um usuário.
   */
  async desativar(id) {
    const rows = await db
      .update(usuario)
      .set({ idStatusUsuario: 2 })
      .where(eq(usuario.idUsuario, id))
      .returning({ id_usuario: usuario.idUsuario });

    return rows.length > 0;
  }
}