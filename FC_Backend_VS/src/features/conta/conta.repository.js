// =============================================================================
// models/repositories/conta.repository.js
// Acesso ao banco de dados para a tabela de conta (via Drizzle ORM)
// =============================================================================

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { conta, usuario, moeda } from "../../db/schema.js";

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

export class ContaRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(conta)
      .orderBy(desc(conta.idConta));
    return mapRows(rows);
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(conta)
      .where(eq(conta.idConta, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findByIdAndUsuario(id, id_usuario) {
    const rows = await db
      .select()
      .from(conta)
      .where(and(eq(conta.idConta, id), eq(conta.idUsuario, id_usuario)));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findAllByUsuario(id_usuario) {
    const rows = await db
      .select()
      .from(conta)
      .where(eq(conta.idUsuario, id_usuario))
      .orderBy(desc(conta.idConta));
    return mapRows(rows);
  }

  async archiveByUsuario(id_usuario) {
    // A coluna "ativo" é varchar no schema; o fragmento sql preserva
    // exatamente o SQL gerado antes da migração (SET ativo = FALSE).
    const rows = await db
      .update(conta)
      .set({ ativo: sql`FALSE` })
      .where(eq(conta.idUsuario, id_usuario))
      .returning();
    return mapRows(rows);
  }

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    const rows = await db
      .insert(conta)
      .values(
        semUndefined({
          idUsuario: id_usuario,
          idMoeda: id_moeda,
          nomeConta: nome_conta,
          saldoConta: saldo_conta,
        }),
      )
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async update(id, nome_conta) {
    const rows = await db
      .update(conta)
      .set({ nomeConta: nome_conta })
      .where(eq(conta.idConta, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async arquivar(id) {
    const rows = await db
      .update(conta)
      .set({ ativo: sql`FALSE` })
      .where(eq(conta.idConta, id))
      .returning({ id_conta: conta.idConta });
    return rows.length > 0;
  }

  async desarquivar(id) {
    const rows = await db
      .update(conta)
      .set({ ativo: sql`TRUE` })
      .where(eq(conta.idConta, id))
      .returning({ id_conta: conta.idConta });
    return rows.length > 0;
  }

  // Busca todas as contas associadas a um usuário específico
  // Realiza INNER JOIN entre tabelas conta, usuario e moeda
  // Retorna: array contendo id_conta, id_usuario, id_moeda, nome_conta,
  //          saldo_conta, nome_user, moeda e ativo
  async search(id) {
    const rows = await db
      .select({
        id_conta: conta.idConta,
        id_usuario: conta.idUsuario,
        id_moeda: conta.idMoeda,
        nome_conta: conta.nomeConta,
        saldo_conta: conta.saldoConta,
        nome_user: usuario.nomeUsuario,
        moeda: moeda.nomeMoeda,
        ativo: conta.ativo,
      })
      .from(conta)
      .innerJoin(usuario, eq(conta.idUsuario, usuario.idUsuario))
      .innerJoin(moeda, eq(conta.idMoeda, moeda.idMoeda))
      .where(eq(conta.idUsuario, id));
    return rows;
  }

  // Busca um usuário específico pelo ID
  // Retorna: objeto com dados do usuário ou null se não encontrado
  async findUserById(id) {
    const rows = await db
      .select()
      .from(usuario)
      .where(eq(usuario.idUsuario, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }
}
