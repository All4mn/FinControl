-- =============================================================================
-- FinControl — Schema SQL (execute no Neon para criar as tabelas)
-- =============================================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) UNIQUE NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  criado_em    TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de métodos de pagamento
CREATE TABLE IF NOT EXISTS metodos (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(80) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id         SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  nome       VARCHAR(80) NOT NULL,
  tipo       VARCHAR(20) CHECK (tipo IN ('receita', 'despesa', 'ambos')) DEFAULT 'ambos',
  cor        VARCHAR(7)  DEFAULT '#6366f1',
  icone      VARCHAR(10) DEFAULT '📦',
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- Tabela de contas bancárias/carteiras
CREATE TABLE IF NOT EXISTS contas (
  id           SERIAL PRIMARY KEY,
  usuario_id   INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome         VARCHAR(100) NOT NULL,
  tipo         VARCHAR(50) NOT NULL,  -- ex: corrente, poupança, carteira
  saldo_inicial NUMERIC(12,2) DEFAULT 0,
  saldo_atual   NUMERIC(12,2) DEFAULT 0,
  criado_em    TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transacoes (
  id           SERIAL PRIMARY KEY,
  usuario_id   INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conta_id     INT REFERENCES contas(id) ON DELETE SET NULL,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  metodo_id    INT REFERENCES metodos(id) ON DELETE SET NULL,
  tipo         VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  descricao    TEXT,
  valor        NUMERIC(12,2) NOT NULL CHECK (valor > 0),
  data         DATE NOT NULL,
  criado_em    TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Dados iniciais (métodos de pagamento)
INSERT INTO metodos (nome, descricao) VALUES
  ('Dinheiro',          'Pagamento em espécie'),
  ('Cartão de Débito',  'Débito direto na conta'),
  ('Cartão de Crédito', 'Crédito parcelado ou à vista'),
  ('PIX',               'Transferência instantânea'),
  ('Boleto',            'Pagamento por boleto bancário'),
  ('TED/DOC',           'Transferência eletrônica')
ON CONFLICT DO NOTHING;
