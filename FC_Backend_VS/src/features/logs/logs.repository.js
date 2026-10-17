// =============================================================================
// models/repositories/logs.repository.js
// Acesso ao banco de dados para a tabela de logs (via Drizzle ORM)
// =============================================================================

import { asc, sql } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import { logs } from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

export class LogsRepository {
  async findAll() {
    const rows = await db
      .select()
      .from(logs)
      .orderBy(asc(logs.idLog));
    return mapRows(rows);
  }

  async findFiltered() {
    // Consulta analítica complexa mantida em SQL bruto (via drizzle db.execute),
    // pois envolve CTE e desempacotamento de JSONB.
    const { rows } = await db.execute(sql`
    WITH dados AS (
      SELECT
        l.id_log,
        l.operacao,
        l.data AS data_log,

        (l.posterior->>'id_conta')::INT          AS id_conta,
        (l.posterior->>'id_carteira')::INT       AS id_carteira,
        (l.posterior->>'id_categoria')::INT      AS id_categoria,
        (l.posterior->>'valor')::FLOAT           AS valor,
        l.posterior->>'descricao'                AS descricao,
        (l.posterior->>'quitado')::BOOLEAN       AS quitado,
        (l.posterior->>'arquivado')::BOOLEAN     AS arquivado,
        (l.posterior->>'entrada')::BOOLEAN       AS entrada,
        (l.posterior->>'data')::TIMESTAMPTZ      AS data_transacao,
        (l.posterior->>'id_transacao')::INT      AS id_transacao,

        (l.anterior->>'valor')::FLOAT            AS valor_antes,
        l.anterior->>'descricao'                 AS descricao_antes,
        (l.anterior->>'arquivado')::BOOLEAN      AS arquivado_antes,
        (l.anterior->>'entrada')::BOOLEAN        AS entrada_antes,
        (l.anterior->>'data')::TIMESTAMPTZ       AS data_antes

      FROM logs l
      WHERE l.tabela = 'transacao'
    )

    SELECT
      d.id_log,
      d.operacao,
      d.data_log,
      d.id_transacao,

      co.nome_conta,
      ca.nome_carteira,
      cat.nome_categoria,

      d.valor,
      d.descricao,
      d.quitado,
      d.arquivado,
      d.entrada,
      d.data_transacao,

      NULLIF(d.valor_antes,      d.valor)          AS valor_antes,
      NULLIF(d.descricao_antes,  d.descricao)      AS descricao_antes,
      NULLIF(d.arquivado_antes,  d.arquivado)      AS arquivado_antes,
      NULLIF(d.entrada_antes,    d.entrada)        AS entrada_antes,
      NULLIF(d.data_antes,       d.data_transacao) AS data_antes

    FROM dados d

    LEFT JOIN conta     co  ON co.id_conta       = d.id_conta
    LEFT JOIN carteira  ca  ON ca.id_carteira     = d.id_carteira
    LEFT JOIN categoria cat ON cat.id_categoria   = d.id_categoria

    ORDER BY d.id_log DESC;
    `);
    return rows;
  }
}