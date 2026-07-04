BEGIN;

ALTER TABLE carteira
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;

-- Ajusta a referência para não apagar carteiras quando usuário for deletado
ALTER TABLE carteira DROP CONSTRAINT IF EXISTS carteira_id_usuario_fkey;

ALTER TABLE carteira
  ALTER COLUMN id_usuario DROP NOT NULL;

ALTER TABLE carteira
  ADD CONSTRAINT carteira_id_usuario_fkey FOREIGN KEY (id_usuario)
  REFERENCES usuario(id_usuario) ON DELETE SET NULL;

COMMIT;
