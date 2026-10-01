// =============================================================================
// models/repositories/transacao.repository.js
// Acesso ao banco de dados para a tabela de transacao (via Drizzle ORM)
// =============================================================================

import { eq, desc } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { transacao } from "../../db/schema.js";

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

export class TransacaoRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(transacao)
      .orderBy(desc(transacao.data));
    return mapRows(rows);
  }

  async archive(id) {
    const rows = await db
      .update(transacao)
      .set({ arquivado: true })
      .where(eq(transacao.idTransacao, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(transacao)
      .where(eq(transacao.idTransacao, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async create(dados) {
    const rows = await db
      .insert(transacao)
      .values(
        semUndefined({
          idConta: dados.id_conta,
          idCategoria: dados.id_categoria,
          idMetodo: dados.id_metodo,
          idCarteira: dados.id_carteira,
          valor: dados.valor,
          descricao: dados.descricao,
          quitado: dados.quitado,
          arquivado: dados.arquivado,
          data: dados.data,
          entrada: dados.entrada,
        }),
      )
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async update(id, dados) {
    const rows = await db
      .update(transacao)
      .set(
        semUndefined({
          idConta: dados.id_conta,
          idCategoria: dados.id_categoria,
          idMetodo: dados.id_metodo,
          idCarteira: dados.id_carteira,
          valor: dados.valor,
          descricao: dados.descricao,
          quitado: dados.quitado,
          arquivado: dados.arquivado,
          data: dados.data,
          entrada: dados.entrada,
        }),
      )
      .where(eq(transacao.idTransacao, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const rows = await db
      .delete(transacao)
      .where(eq(transacao.idTransacao, id))
      .returning({ id_transacao: transacao.idTransacao });
    return rows.length > 0;
  }
}