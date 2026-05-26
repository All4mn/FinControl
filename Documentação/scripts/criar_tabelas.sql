-- Script de criação das tabelas do FinControl (PostgreSQL)

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario SERIAL PRIMARY KEY,
  nome_usuario VARCHAR(100) NOT NULL,
  email_usuario VARCHAR(150) NOT NULL UNIQUE,
  senha_usuario VARCHAR(255),
  telefone_usuario VARCHAR(20),
  google_id_usuario VARCHAR(255) UNIQUE,
  id_status_usuario INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categoria (
  id_categoria SERIAL PRIMARY KEY,
  nome_categoria VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS metodo (
  id_metodo SERIAL PRIMARY KEY,
  nome_metodo VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS moeda (
  id_moeda SERIAL PRIMARY KEY,
  nome_moeda VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS conta (
  id_conta SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_moeda INT REFERENCES moeda(id_moeda) ON DELETE SET NULL,
  nome_conta VARCHAR(100) NOT NULL,
  saldo_conta NUMERIC(14,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS carteira (
  id_carteira SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  nome_carteira VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS carteira_has_conta (
  id_carteira_has_conta SERIAL PRIMARY KEY,
  id_carteira INT REFERENCES carteira(id_carteira) ON DELETE CASCADE,
  id_conta INT REFERENCES conta(id_conta) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transacao (
  id_transacao SERIAL PRIMARY KEY,
  id_conta INT REFERENCES conta(id_conta) ON DELETE SET NULL,
  id_categoria INT REFERENCES categoria(id_categoria) ON DELETE SET NULL,
  id_metodo INT REFERENCES metodo(id_metodo) ON DELETE SET NULL,
  id_carteira INT REFERENCES carteira(id_carteira) ON DELETE SET NULL,
  valor NUMERIC(14,2) NOT NULL,
  descricao TEXT,
  quitado BOOLEAN DEFAULT FALSE,
  arquivado BOOLEAN DEFAULT FALSE,
  data TIMESTAMP NOT NULL,
  entrada BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS logs (
  id_log SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  operacao VARCHAR(50) NOT NULL,
  tabela VARCHAR(50) NOT NULL,
  anterior JSONB,
  posterior JSONB,
  data TIMESTAMP DEFAULT NOW()
);

-- Índices adicionais (opcional)
CREATE INDEX IF NOT EXISTS idx_transacao_data ON transacao(data);
CREATE INDEX IF NOT EXISTS idx_conta_usuario ON conta(id_usuario);
