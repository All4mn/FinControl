// =============================================================================
// models/repositories/transacao.repository.js
// Acesso ao banco de dados para a tabela de transacao
// =============================================================================

import database from "../../config/db.js";

export class TransacaoRepository {
  async withTransaction(operation) {
    const client = await database.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await operation(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async atualizarSaldo(client, id_conta, valor, entrada, aplicado) {
    if (!aplicado) return;
    const variacao = (entrada ? 1 : -1) * Number(valor);
    await client.query(
      `UPDATE conta
       SET saldo_conta = COALESCE(saldo_conta, 0) + $1
       WHERE id_conta = $2`,
      [variacao, id_conta],
    );
  }

  async findAll(id_usuario) {
    const response = await database.query(
      `SELECT t.*, c.nome_conta, moeda.nome_moeda, cat.nome_categoria, m.nome_metodo
       FROM transacao t
       INNER JOIN conta c ON c.id_conta = t.id_conta
       LEFT JOIN moeda ON moeda.id_moeda = c.id_moeda
       LEFT JOIN categoria cat ON cat.id_categoria = t.id_categoria
       LEFT JOIN metodo m ON m.id_metodo = t.id_metodo
       WHERE c.id_usuario = $1 AND t.arquivado = FALSE
       ORDER BY t.data DESC, t.id_transacao DESC`,
      [id_usuario],
    );
    return response.rows;
  }

  async archive(id, id_usuario) {
    return this.withTransaction(async (client) => {
      const existente = await client.query(
        `SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = $1 AND c.id_usuario = $2
         FOR UPDATE OF t, c`,
        [id, id_usuario],
      );
      const transacao = existente.rows[0];
      if (!transacao) return null;
      if (transacao.arquivado) return transacao;

      await this.atualizarSaldo(
        client,
        transacao.id_conta,
        transacao.valor,
        !transacao.entrada,
        transacao.quitado,
      );
      const response = await client.query(
        `UPDATE transacao SET arquivado = true
         WHERE id_transacao = $1 RETURNING *`,
        [id],
      );
      return response.rows[0];
    });
  }

  async findById(id, id_usuario) {
    const response = await database.query(
      `SELECT t.* FROM transacao t
       INNER JOIN conta c ON c.id_conta = t.id_conta
       WHERE t.id_transacao = $1 AND c.id_usuario = $2`,
      [id, id_usuario],
    );
    return response.rows[0] || null;
  }

  async create({
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
  }, id_usuario) {
    return this.withTransaction(async (client) => {
      const conta = await client.query(
        "SELECT id_conta FROM conta WHERE id_conta = $1 AND id_usuario = $2 FOR UPDATE",
        [id_conta, id_usuario],
      );
      if (!conta.rows.length) return null;
      if (id_carteira) {
        const carteira = await client.query(
          "SELECT id_carteira FROM carteira WHERE id_carteira = $1 AND id_usuario = $2",
          [id_carteira, id_usuario],
        );
        if (!carteira.rows.length) return null;
      }

      const response = await client.query(
        `INSERT INTO transacao
          (id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada],
      );
      await this.atualizarSaldo(client, id_conta, valor, entrada, quitado && !arquivado);
      return response.rows[0];
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
    return this.withTransaction(async (client) => {
      const existente = await client.query(
        `SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = $1 AND c.id_usuario = $2
         FOR UPDATE OF t`,
        [id, id_usuario],
      );
      const anterior = existente.rows[0];
      if (!anterior) return null;

      const contas = await client.query(
        `SELECT id_conta FROM conta
         WHERE id_conta = ANY($1::int[]) AND id_usuario = $2
         ORDER BY id_conta FOR UPDATE`,
        [[...new Set([anterior.id_conta, Number(id_conta)])], id_usuario],
      );
      if (contas.rows.length !== new Set([anterior.id_conta, Number(id_conta)]).size) return null;
      if (id_carteira) {
        const carteira = await client.query(
          "SELECT id_carteira FROM carteira WHERE id_carteira = $1 AND id_usuario = $2",
          [id_carteira, id_usuario],
        );
        if (!carteira.rows.length) return null;
      }

      await this.atualizarSaldo(
        client,
        anterior.id_conta,
        anterior.valor,
        !anterior.entrada,
        anterior.quitado && !anterior.arquivado,
      );
      const response = await client.query(
        `UPDATE transacao
         SET id_conta = $1, id_categoria = $2, id_metodo = $3, id_carteira = $4,
             valor = $5, descricao = $6, quitado = $7, arquivado = $8, data = $9, entrada = $10
         WHERE id_transacao = $11 RETURNING *`,
        [id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada, id],
      );
      await this.atualizarSaldo(client, id_conta, valor, entrada, quitado && !arquivado);
      return response.rows[0] || null;
    });
  }

  async delete(id, id_usuario) {
    return this.withTransaction(async (client) => {
      const existente = await client.query(
        `SELECT t.* FROM transacao t
         INNER JOIN conta c ON c.id_conta = t.id_conta
         WHERE t.id_transacao = $1 AND c.id_usuario = $2
         FOR UPDATE OF t, c`,
        [id, id_usuario],
      );
      const transacao = existente.rows[0];
      if (!transacao) return false;
      await this.atualizarSaldo(
        client,
        transacao.id_conta,
        transacao.valor,
        !transacao.entrada,
        transacao.quitado && !transacao.arquivado,
      );
      await client.query("DELETE FROM transacao WHERE id_transacao = $1", [id]);
      return true;
    });
  }
}
