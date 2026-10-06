-- Migração: normaliza conta.ativo para BOOLEAN, como transacao.arquivado e
-- carteira.ativo. A coluna foi criada fora dos scripts (VARCHAR) e guardava
-- 'true', '1' e 'false', o que quebrava todo filtro "ativo = TRUE" — inclusive
-- o que exclui contas arquivadas do saldo consolidado.
--
-- O cast é fiel para os três valores: 'true'->true, '1'->true, 'false'->false.
--
-- Rollback:
--   UPDATE conta SET ativo = ativo::text;
--   ALTER TABLE conta ALTER COLUMN ativo TYPE VARCHAR(5) USING ativo::text;

-- Cobre base legada (tem a coluna) e base nova (não tem), sem quebrar nenhuma
-- das duas.
ALTER TABLE conta ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'conta'
       AND column_name = 'ativo'
       AND data_type <> 'boolean'
  ) THEN
    ALTER TABLE conta
      ALTER COLUMN ativo DROP DEFAULT;
    ALTER TABLE conta
      ALTER COLUMN ativo TYPE BOOLEAN USING ativo::boolean;
    RAISE NOTICE 'conta.ativo convertido de VARCHAR para BOOLEAN';
  END IF;
END
$$;

-- Valores inválidos ou nulos viram TRUE, seguindo o DEFAULT (conta nova nasce ativa).
UPDATE conta SET ativo = TRUE WHERE ativo IS NULL;

ALTER TABLE conta ALTER COLUMN ativo SET DEFAULT TRUE;

-- NOT NULL só se ainda aceita NULL, para não falhar em base já normalizada.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = current_schema()
       AND table_name = 'conta'
       AND column_name = 'ativo'
       AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE conta ALTER COLUMN ativo SET NOT NULL;
  END IF;
END
$$;

-- Índice parcial para as consultas de conta ativa (saldo consolidado).
CREATE INDEX IF NOT EXISTS idx_conta_ativo ON conta(id_usuario) WHERE ativo = TRUE;
