// =============================================================================
// models/repositories/logs.repository.js
// Acesso ao banco de dados para a tabela de logs
// =============================================================================

import database from "../../config/db.js";

export class LogsRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM logs ORDER BY id_log ASC",
    );
    return response.rows;
  }

  async findFiltered() {
    const response = await database.query(
      `WITH dados AS (
  SELECT
    l.id_log,
    l.operacao,
    l.data									 AS data_log,

    -- Desempacota posterior
    (l.posterior->>'id_conta')::INT          AS id_conta,
    (l.posterior->>'id_carteira')::INT       AS id_carteira,
    (l.posterior->>'id_categoria')::INT      AS id_categoria,
    (l.posterior->>'valor')::NUMERIC         AS valor,
    l.posterior->>'descricao'                AS descricao,
    (l.posterior->>'quitado')::BOOLEAN       AS quitado,
    (l.posterior->>'arquivado')::BOOLEAN     AS arquivado,
    (l.posterior->>'entrada')::BOOLEAN       AS entrada,
    (l.posterior->>'data')::TIMESTAMPTZ      AS data_transacao,

    -- Desempacota anterior (NULL em INSERTs, preenchido em UPDATEs)
    (l.anterior->>'valor')::NUMERIC          AS valor_antes,
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
  
  
  -- Vínculos
  co.nome_conta,
  ca.nome_carteira,
  cat.nome_categoria,

  -- Estado atual
  d.valor,
  d.descricao,
  d.quitado,
  d.arquivado,
  d.entrada,
  d.data_transacao,

  -- O que mudou (só aparece quando o campo foi alterado de fato)
  NULLIF(d.valor_antes,      d.valor)          AS valor_antes,
  NULLIF(d.descricao_antes,  d.descricao)      AS descricao_antes,
  NULLIF(d.arquivado_antes,  d.arquivado)      AS arquivado_antes,
  NULLIF(d.entrada_antes,    d.entrada)        AS entrada_antes,
  NULLIF(d.data_antes,       d.data_transacao) AS data_antes

FROM dados d

LEFT JOIN conta     co  ON co.id_conta       = d.id_conta
LEFT JOIN carteira  ca  ON ca.id_carteira     = d.id_carteira
LEFT JOIN categoria cat ON cat.id_categoria   = d.id_categoria

-- ── Filtros opcionais ─────────────────────────────────────────────────────
-- WHERE d.operacao            = 'UPDATE'
-- AND   co.nome_conta         = 'Nome da Conta'
-- AND   ca.nome_carteira      = 'Nome da Carteira'
-- AND   cat.nome_categoria    = 'Nome da Categoria'
-- AND   d.entrada             = TRUE
-- AND   d.arquivado           = FALSE
-- AND   d.data_transacao::DATE BETWEEN '2026-01-01' AND '2026-12-31'

ORDER BY d.id_log DESC;`
    );
    return response.rows;
  }


}
