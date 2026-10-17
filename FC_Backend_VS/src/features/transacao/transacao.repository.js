// =============================================================================
// models/repositories/transacao.repository.js
// Acesso ao banco de dados para a tabela de transacao (via Drizzle ORM)
// =============================================================================

import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import {
  transacao,
  conta,
  moeda,
  categoria,
  metodo,
  carteira,
} from "../../db/schema.js";

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

const camposTransacao = {
  id_transacao: transacao.idTransacao,
  id_conta: transacao.idConta,
  id_categoria: transacao.idCategoria,
  id_metodo: transacao.idMetodo,
  id_carteira: transacao.idCarteira,
  valor: transacao.valor,
  descricao: transacao.descricao,
  quitado: transacao.quitado,
  arquivado: transacao.arquivado,
  data: transacao.data,
  entrada: transacao.entrada,
};

export class TransacaoRepository {
  async withTransaction(operation) {
    return db.transaction(async (tx) => operation(tx));
  }

  async atualizarSaldo(tx, id_conta, valor, entrada, aplicado) {
    if (!aplicado) return;
    const variacao = (entrada ? 1 : -1) * Number(valor);
    await tx
      .update(conta)
      .set({
        saldoConta: sql`COALESCE(${conta.saldoConta}, 0) + ${variacao}`,
      })
      .where(eq(conta.idConta, id_conta));
  }

  async findAll(id_usuario) {
    const rows = await db
      .select({
        ...camposTransacao,
        nome_conta: conta.nomeConta,
        nome_moeda: moeda.nomeMoeda,
        nome_categoria: categoria.nomeCategoria,
        nome_metodo: metodo.nomeMetodo,
      })
      .from(transacao)
      .innerJoin(
        conta,
        and(
          eq(conta.idConta, transacao.idConta),
          sql`${conta.ativo} = TRUE`,
        ),
      )
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .leftJoin(categoria, eq(categoria.idCategoria, transacao.idCategoria))
      .leftJoin(metodo, eq(metodo.idMetodo, transacao.idMetodo))
      .where(
        and(
          eq(conta.idUsuario, id_usuario),
          eq(transacao.arquivado, false),
        ),
      )
      .orderBy(desc(transacao.data), desc(transacao.idTransacao));
    return rows;
  }

  async findArchived(id_usuario) {
    const rows = await db
      .select({
        ...camposTransacao,
        nome_conta: conta.nomeConta,
        nome_moeda: moeda.nomeMoeda,
        nome_categoria: categoria.nomeCategoria,
        nome_metodo: metodo.nomeMetodo,
      })
      .from(transacao)
      .innerJoin(
        conta,
        and(
          eq(conta.idConta, transacao.idConta),
          sql`${conta.ativo} = TRUE`,
        ),
      )
      .leftJoin(moeda, eq(moeda.idMoeda, conta.idMoeda))
      .leftJoin(categoria, eq(categoria.idCategoria, transacao.idCategoria))
      .leftJoin(metodo, eq(metodo.idMetodo, transacao.idMetodo))
      .where(
        and(
          eq(conta.idUsuario, id_usuario),
          eq(transacao.arquivado, true),
        ),
      )
      .orderBy(desc(transacao.data), desc(transacao.idTransacao));
    return rows;
  }

  async archive(id, id_usuario) {
    return this.withTransaction(async (tx) => {
      const result = await tx.execute(sql`
        SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = ${id} AND c.id_usuario = ${id_usuario}
         FOR UPDATE OF t, c`);
      const row = result.rows[0];
      if (!row) return null;
      if (row.arquivado) return row;

      await this.atualizarSaldo(
        tx,
        row.id_conta,
        row.valor,
        !row.entrada,
        row.quitado,
      );
      const updated = await tx
        .update(transacao)
        .set({ arquivado: true })
        .where(eq(transacao.idTransacao, id))
        .returning();
      return mapRow(updated[0]);
    });
  }

  async restore(id, id_usuario) {
    return this.withTransaction(async (tx) => {
      const result = await tx.execute(sql`
        SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = ${id} AND c.id_usuario = ${id_usuario}
         FOR UPDATE OF t, c`);
      const row = result.rows[0];
      if (!row) return null;
      if (!row.arquivado) return row;

      const updated = await tx
        .update(transacao)
        .set({ arquivado: false })
        .where(eq(transacao.idTransacao, id))
        .returning();
      await this.atualizarSaldo(
        tx,
        row.id_conta,
        row.valor,
        row.entrada,
        row.quitado,
      );
      return mapRow(updated[0]);
    });
  }

  async findById(id, id_usuario) {
    const result = await db.execute(sql`
      SELECT t.* FROM transacao t
       INNER JOIN conta c ON c.id_conta = t.id_conta
       WHERE t.id_transacao = ${id} AND c.id_usuario = ${id_usuario}`);
    return result.rows[0] || null;
  }

  async create(
    {
      id_conta,
      id_categoria,
      id_metodo,
      id_carteira,
      valor,
      descricao,
      quitado,
      arquivado,
      data,
      entrada,
    },
    id_usuario,
  ) {
    return this.withTransaction(async (tx) => {
      const contaRows = await tx
        .select({ idConta: conta.idConta })
        .from(conta)
        .where(
          and(
            eq(conta.idConta, id_conta),
            eq(conta.idUsuario, id_usuario),
          ),
        )
        .for("update");
      if (!contaRows.length) return null;

      if (id_carteira) {
        const carteiraRows = await tx
          .select({ idCarteira: carteira.idCarteira })
          .from(carteira)
          .where(
            and(
              eq(carteira.idCarteira, id_carteira),
              eq(carteira.idUsuario, id_usuario),
            ),
          );
        if (!carteiraRows.length) return null;
      }

      const inserted = await tx
        .insert(transacao)
        .values(
          semUndefined({
            idConta: id_conta,
            idCategoria: id_categoria,
            idMetodo: id_metodo,
            idCarteira: id_carteira,
            valor,
            descricao,
            quitado,
            arquivado,
            data,
            entrada,
          }),
        )
        .returning();

      await this.atualizarSaldo(
        tx,
        id_conta,
        valor,
        entrada,
        quitado && !arquivado,
      );
      return mapRow(inserted[0]);
    });
  }

  async update(
    id,
    {
      id_conta,
      id_categoria,
      id_metodo,
      id_carteira,
      valor,
      descricao,
      quitado,
      arquivado,
      data,
      entrada,
    },
    id_usuario,
  ) {
    return this.withTransaction(async (tx) => {
      const result = await tx.execute(sql`
        SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = ${id} AND c.id_usuario = ${id_usuario}
         FOR UPDATE OF t`);
      const anterior = result.rows[0];
      if (!anterior) return null;

      const contasIds = [
        ...new Set([Number(anterior.id_conta), Number(id_conta)]),
      ];
      const contasRows = await tx
        .select({ idConta: conta.idConta })
        .from(conta)
        .where(
          and(
            inArray(conta.idConta, contasIds),
            eq(conta.idUsuario, id_usuario),
          ),
        )
        .orderBy(conta.idConta)
        .for("update");
      if (contasRows.length !== contasIds.length) return null;

      if (id_carteira) {
        const carteiraRows = await tx
          .select({ idCarteira: carteira.idCarteira })
          .from(carteira)
          .where(
            and(
              eq(carteira.idCarteira, id_carteira),
              eq(carteira.idUsuario, id_usuario),
            ),
          );
        if (!carteiraRows.length) return null;
      }

      await this.atualizarSaldo(
        tx,
        anterior.id_conta,
        anterior.valor,
        !anterior.entrada,
        anterior.quitado && !anterior.arquivado,
      );

      const updated = await tx
        .update(transacao)
        .set(
          semUndefined({
            idConta: id_conta,
            idCategoria: id_categoria,
            idMetodo: id_metodo,
            idCarteira: id_carteira,
            valor,
            descricao,
            quitado,
            arquivado,
            data,
            entrada,
          }),
        )
        .where(eq(transacao.idTransacao, id))
        .returning();

      await this.atualizarSaldo(
        tx,
        id_conta,
        valor,
        entrada,
        quitado && !arquivado,
      );
      return mapRow(updated[0]) || null;
    });
  }

  async delete(id, id_usuario) {
    return this.withTransaction(async (tx) => {
      const result = await tx.execute(sql`
        SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = ${id} AND c.id_usuario = ${id_usuario}
         FOR UPDATE OF t, c`);
      const row = result.rows[0];
      if (!row) return false;

      await this.atualizarSaldo(
        tx,
        row.id_conta,
        row.valor,
        !row.entrada,
        row.quitado && !row.arquivado,
      );
      await tx
        .delete(transacao)
        .where(eq(transacao.idTransacao, id));
      return true;
    });
  }
}
