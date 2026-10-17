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
  async withTransaction(operation) {
    return db.transaction(async (tx) => operation(tx));
  }

  // Só ativas: é o que exclui contas arquivadas do saldo consolidado.
  async findAll() {
    const rows = await db
      .select()
      .from(conta)
      .where(sql`${conta.ativo} = TRUE`)
      .orderBy(desc(conta.idConta));
    return mapRows(rows);
  }

  // Sem filtro de ativo: é o que permite desarquivar.
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
      .where(
        and(
          eq(conta.idUsuario, id_usuario),
          sql`${conta.ativo} = TRUE`,
        ),
      )
      .orderBy(desc(conta.idConta));
    return mapRows(rows);
  }

  async archiveByUsuario(id_usuario) {
    const rows = await db
      .update(conta)
      .set({ ativo: sql`FALSE` })
      .where(eq(conta.idUsuario, id_usuario))
      .returning();
    return mapRows(rows);
  }

  // 'tx' opcional: roda dentro da transação de conta.service.create.
  async create(
    { id_usuario, id_moeda, nome_conta, saldo_conta },
    tx = null,
  ) {
    const executor = tx || db;
    const rows = await executor
      .insert(conta)
      .values({
        idUsuario: id_usuario,
        idMoeda: id_moeda,
        nomeConta: nome_conta,
        saldoConta: saldo_conta,
        ativo: sql`TRUE`,
      })
      .returning();
    return mapRow(rows[0]);
  }

  async update(id, nome_conta) {
    const rows = await db
      .update(conta)
      .set({ nomeConta: nome_conta })
      .where(eq(conta.idConta, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  // Soft delete, como transacao.arquivado: saldo e transações ficam intactos,
  // então desarquivar restaura tudo.
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
      .returning();
    return rows.length > 0;
  }

  // LEFT JOIN em usuario/moeda: o schema permite os dois nulos e um INNER JOIN
  // fazia a conta sumir da lista sem erro. apenasAtivas omite arquivadas para as
  // telas operacionais; a de gestão usa a lista completa para reativar.
  async search(id, apenasAtivas = false) {
    const conditions = [eq(conta.idUsuario, id)];
    if (apenasAtivas) {
      conditions.push(sql`${conta.ativo} = TRUE`);
    }

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
      .leftJoin(usuario, eq(usuario.idUsuario, conta.idUsuario))
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .where(and(...conditions))
      .orderBy(desc(conta.ativo), desc(conta.idConta));
    return rows;
  }

  async findUserById(id) {
    const rows = await db
      .select()
      .from(usuario)
      .where(eq(usuario.idUsuario, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }
}
