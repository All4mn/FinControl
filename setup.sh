#!/bin/bash

# =============================================================================
# 🏦 FinControl - Script de Setup Automático
# Projeto Fullstack: Node.js + Express + PostgreSQL (Neon) + React + Vite
# =============================================================================
# Uso:
#   chmod +x setup.sh
#   ./setup.sh
# =============================================================================

set -e  # Aborta se qualquer comando falhar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}${BOLD}"
echo "  ███████╗██╗███╗   ██╗ ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     "
echo "  ██╔════╝██║████╗  ██║██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     "
echo "  █████╗  ██║██╔██╗ ██║██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     "
echo "  ██╔══╝  ██║██║╚██╗██║██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     "
echo "  ██║     ██║██║ ╚████║╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗"
echo "  ╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝"
echo -e "${NC}"
echo -e "${BOLD}  Configuração Automática do Projeto FinControl${NC}"
echo -e "  Backend: Node.js + Express + PostgreSQL (Neon)"
echo -e "  Frontend: React + Vite"
echo ""

# Função de log
log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✓]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[AVISO]${NC} $1"; }
log_error()   { echo -e "${RED}[ERRO]${NC} $1"; exit 1; }
log_step()    { echo -e "\n${CYAN}${BOLD}━━━ $1 ━━━${NC}"; }

# Verificar dependências necessárias
log_step "Verificando dependências"

command -v node >/dev/null 2>&1  || log_error "Node.js não encontrado. Instale em: https://nodejs.org"
command -v npm  >/dev/null 2>&1  || log_error "npm não encontrado. Instale junto com Node.js"

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
log_success "Node.js ${NODE_VERSION} encontrado"
log_success "npm v${NPM_VERSION} encontrado"

# =============================================================================
# ETAPA 1: Criar estrutura de diretórios
# =============================================================================
log_step "Criando estrutura de diretórios"

mkdir -p FinControl/backend/{server,routes,controllers,models,config,middlewares}
mkdir -p FinControl/frontend/src/{components/{common,layout},pages,services,hooks,utils,styles}

log_success "Estrutura de pastas criada"
tree FinControl 2>/dev/null || find FinControl -type d | sed 's|[^/]*/|  |g'

# =============================================================================
# ETAPA 2: Inicializar Backend
# =============================================================================
log_step "Inicializando Backend (Node.js + Express)"

cd FinControl/backend

# Inicializar package.json
npm init -y > /dev/null 2>&1

# Atualizar package.json com metadados e scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.name = 'fincontrol-backend';
pkg.description = 'API REST do FinControl - Controle Financeiro Pessoal';
pkg.main = 'server/index.js';
pkg.scripts = {
  start: 'node server/index.js',
  dev: 'nodemon server/index.js',
  test: 'echo \"Testes não configurados\" && exit 0'
};
pkg.engines = { node: '>=18.0.0' };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

log_success "package.json configurado"

# Instalar dependências de produção
log_info "Instalando dependências de produção..."
npm install express pg dotenv cors > /dev/null 2>&1
log_success "express, pg, dotenv, cors instalados"

# Instalar dependências de desenvolvimento
log_info "Instalando dependências de desenvolvimento..."
npm install --save-dev nodemon > /dev/null 2>&1
log_success "nodemon instalado (dev)"

# =============================================================================
# ETAPA 3: Criar arquivos de configuração do Backend
# =============================================================================
log_step "Criando arquivos de configuração"

# ─── .env ────────────────────────────────────────────────────────────────────
cat > .env << 'EOF'
# ============================================================
# FinControl - Variáveis de Ambiente (Backend)
# ⚠️  Nunca commitar este arquivo! Adicione ao .gitignore
# ============================================================

# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados (Neon PostgreSQL)
DB_HOST=ep-purple-rice-amji35uy-pooler.c-5.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=npg_PtTFvOGf5kB1
DB_SSL=true

# JWT (troque por uma string segura em produção!)
JWT_SECRET=fincontrol_jwt_secret_troque_em_producao
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
EOF

log_success ".env criado com configurações do Neon"

# ─── .env.example ─────────────────────────────────────────────────────────────
cat > .env.example << 'EOF'
# ============================================================
# FinControl - Variáveis de Ambiente (Exemplo)
# Copie para .env e preencha com seus valores reais
# ============================================================

# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados (PostgreSQL / Neon)
DB_HOST=seu-host.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SSL=true

# JWT
JWT_SECRET=sua_chave_jwt_secreta_aqui
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
EOF

log_success ".env.example criado"

# ─── .gitignore ───────────────────────────────────────────────────────────────
cat > .gitignore << 'EOF'
# Dependências
node_modules/

# Variáveis de ambiente
.env

# Logs
logs/
*.log
npm-debug.log*

# Sistema
.DS_Store
Thumbs.db

# Build
dist/
build/
EOF

log_success ".gitignore criado"

# =============================================================================
# ETAPA 4: Criar config/database.js
# =============================================================================
log_step "Criando config/database.js (Conexão Neon + SSL)"

cat > config/database.js << 'EOF'
// =============================================================================
// config/database.js
// Configuração do Pool de conexão com PostgreSQL (Neon) via SSL
// =============================================================================

const { Pool } = require('pg');
require('dotenv').config();

/**
 * Pool de conexões com o banco de dados.
 * Neon requer SSL — rejectUnauthorized: false para certificados self-signed.
 */
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // Necessário para Neon
  },
  // Configurações do pool
  max:              10,   // máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // fecha conexão ociosa após 30s
  connectionTimeoutMillis: 5000, // timeout ao tentar conectar
});

// Evento de conexão bem-sucedida
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔗 Conexão com PostgreSQL (Neon) estabelecida');
  }
});

// Evento de erro no pool
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões:', err.message);
  process.exit(-1);
});

/**
 * Testa a conexão com o banco ao iniciar o servidor.
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    console.log(`✅ Banco conectado — Hora do servidor: ${result.rows[0].current_time}`);
    client.release();
  } catch (err) {
    console.error('❌ Falha ao conectar no banco de dados:', err.message);
    throw err;
  }
};

module.exports = { pool, testConnection };
EOF

log_success "config/database.js criado"

# =============================================================================
# ETAPA 5: Criar Models (queries SQL)
# =============================================================================
log_step "Criando Models (queries SQL isoladas)"

# ─── models/usuarioModel.js ───────────────────────────────────────────────────
cat > models/usuarioModel.js << 'EOF'
// =============================================================================
// models/usuarioModel.js
// Queries SQL para a tabela de usuários
// =============================================================================

const { pool } = require('../config/database');

const UsuarioModel = {
  /**
   * Busca todos os usuários (sem senha).
   */
  async findAll() {
    const { rows } = await pool.query(
      'SELECT id, nome, email, criado_em FROM usuarios ORDER BY criado_em DESC'
    );
    return rows;
  },

  /**
   * Busca usuário por ID.
   * @param {number} id
   */
  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Busca usuário por e-mail (inclui senha para autenticação).
   * @param {string} email
   */
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Cria um novo usuário.
   * @param {Object} dados - { nome, email, senha_hash }
   */
  async create({ nome, email, senha_hash }) {
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, criado_em`,
      [nome, email, senha_hash]
    );
    return rows[0];
  },

  /**
   * Atualiza dados de um usuário.
   * @param {number} id
   * @param {Object} dados - { nome, email }
   */
  async update(id, { nome, email }) {
    const { rows } = await pool.query(
      `UPDATE usuarios
       SET nome = $1, email = $2, atualizado_em = NOW()
       WHERE id = $3
       RETURNING id, nome, email, atualizado_em`,
      [nome, email, id]
    );
    return rows[0] || null;
  },

  /**
   * Remove um usuário por ID.
   * @param {number} id
   */
  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = UsuarioModel;
EOF

# ─── models/contaModel.js ─────────────────────────────────────────────────────
cat > models/contaModel.js << 'EOF'
// =============================================================================
// models/contaModel.js
// Queries SQL para contas bancárias/carteiras
// =============================================================================

const { pool } = require('../config/database');

const ContaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM contas WHERE usuario_id = $1 ORDER BY criado_em DESC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      'SELECT * FROM contas WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, saldo_inicial = 0 }) {
    const { rows } = await pool.query(
      `INSERT INTO contas (usuario_id, nome, tipo, saldo_inicial, saldo_atual)
       VALUES ($1, $2, $3, $4, $4)
       RETURNING *`,
      [usuario_id, nome, tipo, saldo_inicial]
    );
    return rows[0];
  },

  async update(id, usuario_id, { nome, tipo }) {
    const { rows } = await pool.query(
      `UPDATE contas
       SET nome = $1, tipo = $2, atualizado_em = NOW()
       WHERE id = $3 AND usuario_id = $4
       RETURNING *`,
      [nome, tipo, id, usuario_id]
    );
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM contas WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },
};

module.exports = ContaModel;
EOF

# ─── models/transacaoModel.js ─────────────────────────────────────────────────
cat > models/transacaoModel.js << 'EOF'
// =============================================================================
// models/transacaoModel.js
// Queries SQL para transações financeiras
// =============================================================================

const { pool } = require('../config/database');

const TransacaoModel = {
  async findAll(usuario_id, filtros = {}) {
    let query = `
      SELECT t.*, c.nome AS categoria_nome, m.nome AS metodo_nome
      FROM transacoes t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      LEFT JOIN metodos m ON t.metodo_id = m.id
      WHERE t.usuario_id = $1
    `;
    const params = [usuario_id];
    let idx = 2;

    if (filtros.tipo) {
      query += ` AND t.tipo = $${idx++}`;
      params.push(filtros.tipo);
    }
    if (filtros.conta_id) {
      query += ` AND t.conta_id = $${idx++}`;
      params.push(filtros.conta_id);
    }
    if (filtros.data_inicio) {
      query += ` AND t.data >= $${idx++}`;
      params.push(filtros.data_inicio);
    }
    if (filtros.data_fim) {
      query += ` AND t.data <= $${idx++}`;
      params.push(filtros.data_fim);
    }

    query += ' ORDER BY t.data DESC, t.criado_em DESC';

    const { rows } = await pool.query(query, params);
    return rows;
  },

  async findById(id, usuario_id) {
    const { rows } = await pool.query(
      `SELECT t.*, c.nome AS categoria_nome, m.nome AS metodo_nome
       FROM transacoes t
       LEFT JOIN categorias c ON t.categoria_id = c.id
       LEFT JOIN metodos m ON t.metodo_id = m.id
       WHERE t.id = $1 AND t.usuario_id = $2`,
      [id, usuario_id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data }) {
    const { rows } = await pool.query(
      `INSERT INTO transacoes (usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data]
    );
    return rows[0];
  },

  async update(id, usuario_id, dados) {
    const { descricao, valor, data, categoria_id, metodo_id, tipo } = dados;
    const { rows } = await pool.query(
      `UPDATE transacoes
       SET descricao = $1, valor = $2, data = $3,
           categoria_id = $4, metodo_id = $5, tipo = $6,
           atualizado_em = NOW()
       WHERE id = $7 AND usuario_id = $8
       RETURNING *`,
      [descricao, valor, data, categoria_id, metodo_id, tipo, id, usuario_id]
    );
    return rows[0] || null;
  },

  async delete(id, usuario_id) {
    const { rowCount } = await pool.query(
      'DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2',
      [id, usuario_id]
    );
    return rowCount > 0;
  },

  async resumo(usuario_id) {
    const { rows } = await pool.query(
      `SELECT
         SUM(CASE WHEN tipo = 'receita'  THEN valor ELSE 0 END) AS total_receitas,
         SUM(CASE WHEN tipo = 'despesa'  THEN valor ELSE 0 END) AS total_despesas,
         COUNT(*) AS total_transacoes
       FROM transacoes
       WHERE usuario_id = $1`,
      [usuario_id]
    );
    return rows[0];
  },
};

module.exports = TransacaoModel;
EOF

# ─── models/categoriaModel.js ─────────────────────────────────────────────────
cat > models/categoriaModel.js << 'EOF'
// =============================================================================
// models/categoriaModel.js
// Queries SQL para categorias de transações
// =============================================================================

const { pool } = require('../config/database');

const CategoriaModel = {
  async findAll(usuario_id) {
    const { rows } = await pool.query(
      `SELECT * FROM categorias
       WHERE usuario_id = $1 OR usuario_id IS NULL
       ORDER BY nome ASC`,
      [usuario_id]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM categorias WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ usuario_id, nome, tipo, cor, icone }) {
    const { rows } = await pool.query(
      `INSERT INTO categorias (usuario_id, nome, tipo, cor, icone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [usuario_id, nome, tipo, cor || '#6366f1', icone || '📦']
    );
    return rows[0];
  },

  async update(id, { nome, tipo, cor, icone }) {
    const { rows } = await pool.query(
      `UPDATE categorias
       SET nome = $1, tipo = $2, cor = $3, icone = $4
       WHERE id = $5
       RETURNING *`,
      [nome, tipo, cor, icone, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM categorias WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = CategoriaModel;
EOF

# ─── models/metodoModel.js ────────────────────────────────────────────────────
cat > models/metodoModel.js << 'EOF'
// =============================================================================
// models/metodoModel.js
// Queries SQL para métodos de pagamento
// =============================================================================

const { pool } = require('../config/database');

const MetodoModel = {
  async findAll() {
    const { rows } = await pool.query(
      'SELECT * FROM metodos ORDER BY nome ASC'
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM metodos WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nome, descricao }) {
    const { rows } = await pool.query(
      `INSERT INTO metodos (nome, descricao) VALUES ($1, $2) RETURNING *`,
      [nome, descricao]
    );
    return rows[0];
  },

  async update(id, { nome, descricao }) {
    const { rows } = await pool.query(
      `UPDATE metodos SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *`,
      [nome, descricao, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    const { rowCount } = await pool.query(
      'DELETE FROM metodos WHERE id = $1',
      [id]
    );
    return rowCount > 0;
  },
};

module.exports = MetodoModel;
EOF

log_success "Models criados (usuario, conta, transacao, categoria, metodo)"

# =============================================================================
# ETAPA 6: Criar Controllers (regras de negócio)
# =============================================================================
log_step "Criando Controllers (regras de negócio)"

# ─── controllers/authController.js ───────────────────────────────────────────
cat > controllers/authController.js << 'EOF'
// =============================================================================
// controllers/authController.js
// Lógica de autenticação: registro e login
// =============================================================================

const crypto = require('crypto');
const UsuarioModel = require('../models/usuarioModel');

/**
 * Gera hash SHA-256 simples da senha.
 * Em produção, use bcrypt: npm install bcrypt
 */
const hashSenha = (senha) =>
  crypto.createHash('sha256').update(senha).digest('hex');

const AuthController = {
  /**
   * POST /auth/registro
   * Cria um novo usuário no sistema.
   */
  async registro(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, e-mail e senha são obrigatórios',
        });
      }

      // Verifica se e-mail já existe
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'E-mail já cadastrado',
        });
      }

      const senha_hash = hashSenha(senha);
      const novoUsuario = await UsuarioModel.create({ nome, email, senha_hash });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso',
        dados: novoUsuario,
      });
    } catch (err) {
      console.error('Erro no registro:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
  },

  /**
   * POST /auth/login
   * Autentica o usuário e retorna token JWT simples.
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'E-mail e senha são obrigatórios',
        });
      }

      const usuario = await UsuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
      }

      const senhaCorreta = usuario.senha_hash === hashSenha(senha);
      if (!senhaCorreta) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
      }

      // Token simples (em produção, use jsonwebtoken)
      const token = Buffer.from(
        JSON.stringify({ id: usuario.id, email: usuario.email, exp: Date.now() + 86400000 })
      ).toString('base64');

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      });
    } catch (err) {
      console.error('Erro no login:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
  },

  /**
   * GET /auth/me
   * Retorna dados do usuário autenticado (stub - implementar middleware JWT).
   */
  async me(req, res) {
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Endpoint /auth/me — implemente middleware JWT para autenticar',
    });
  },
};

module.exports = AuthController;
EOF

# ─── controllers/usuarioController.js ────────────────────────────────────────
cat > controllers/usuarioController.js << 'EOF'
// =============================================================================
// controllers/usuarioController.js
// CRUD de usuários
// =============================================================================

const UsuarioModel = require('../models/usuarioModel');

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      return res.status(200).json({ sucesso: true, dados: usuarios });
    } catch (err) {
      console.error('Erro ao listar usuários:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email } = req.body;
      const usuario = await UsuarioModel.update(id, { nome, email });
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await UsuarioModel.delete(id);
      if (!deletado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, mensagem: 'Usuário removido com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = UsuarioController;
EOF

# ─── controllers/contaController.js ──────────────────────────────────────────
cat > controllers/contaController.js << 'EOF'
// =============================================================================
// controllers/contaController.js
// CRUD de contas bancárias/carteiras
// =============================================================================

const ContaModel = require('../models/contaModel');

// Stub de usuario_id — em produção, virá do middleware JWT (req.usuario.id)
const getUsuarioId = (req) => req.headers['x-usuario-id'] || 1;

const ContaController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const contas = await ContaModel.findAll(usuario_id);
      return res.status(200).json({ sucesso: true, dados: contas });
    } catch (err) {
      console.error('Erro ao listar contas:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const conta = await ContaModel.findById(id, usuario_id);
      if (!conta) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { nome, tipo, saldo_inicial } = req.body;
      if (!nome || !tipo) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome e tipo são obrigatórios' });
      }
      const conta = await ContaModel.create({ usuario_id, nome, tipo, saldo_inicial });
      return res.status(201).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const conta = await ContaModel.update(id, usuario_id, req.body);
      if (!conta) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const deletado = await ContaModel.delete(id, usuario_id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Conta removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = ContaController;
EOF

# ─── controllers/transacaoController.js ──────────────────────────────────────
cat > controllers/transacaoController.js << 'EOF'
// =============================================================================
// controllers/transacaoController.js
// CRUD de transações financeiras
// =============================================================================

const TransacaoModel = require('../models/transacaoModel');

const getUsuarioId = (req) => req.headers['x-usuario-id'] || 1;

const TransacaoController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { tipo, conta_id, data_inicio, data_fim } = req.query;
      const transacoes = await TransacaoModel.findAll(usuario_id, { tipo, conta_id, data_inicio, data_fim });
      return res.status(200).json({ sucesso: true, dados: transacoes });
    } catch (err) {
      console.error('Erro ao listar transações:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const transacao = await TransacaoModel.findById(id, usuario_id);
      if (!transacao) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { conta_id, categoria_id, metodo_id, tipo, descricao, valor, data } = req.body;

      if (!tipo || !valor || !data) {
        return res.status(400).json({ sucesso: false, mensagem: 'tipo, valor e data são obrigatórios' });
      }
      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ sucesso: false, mensagem: 'tipo deve ser "receita" ou "despesa"' });
      }

      const transacao = await TransacaoModel.create({
        usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data,
      });
      return res.status(201).json({ sucesso: true, dados: transacao });
    } catch (err) {
      console.error('Erro ao criar transação:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const transacao = await TransacaoModel.update(id, usuario_id, req.body);
      if (!transacao) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const deletado = await TransacaoModel.delete(id, usuario_id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Transação removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async resumo(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const dados = await TransacaoModel.resumo(usuario_id);
      return res.status(200).json({ sucesso: true, dados });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = TransacaoController;
EOF

# ─── controllers/categoriaController.js ──────────────────────────────────────
cat > controllers/categoriaController.js << 'EOF'
// =============================================================================
// controllers/categoriaController.js
// CRUD de categorias
// =============================================================================

const CategoriaModel = require('../models/categoriaModel');

const getUsuarioId = (req) => req.headers['x-usuario-id'] || 1;

const CategoriaController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const categorias = await CategoriaModel.findAll(usuario_id);
      return res.status(200).json({ sucesso: true, dados: categorias });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const categoria = await CategoriaModel.findById(req.params.id);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { nome, tipo, cor, icone } = req.body;
      if (!nome || !tipo) return res.status(400).json({ sucesso: false, mensagem: 'Nome e tipo obrigatórios' });
      const categoria = await CategoriaModel.create({ usuario_id, nome, tipo, cor, icone });
      return res.status(201).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const categoria = await CategoriaModel.update(req.params.id, req.body);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const deletado = await CategoriaModel.delete(req.params.id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Categoria removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = CategoriaController;
EOF

# ─── controllers/metodoController.js ─────────────────────────────────────────
cat > controllers/metodoController.js << 'EOF'
// =============================================================================
// controllers/metodoController.js
// CRUD de métodos de pagamento
// =============================================================================

const MetodoModel = require('../models/metodoModel');

const MetodoController = {
  async listar(req, res) {
    try {
      const metodos = await MetodoModel.findAll();
      return res.status(200).json({ sucesso: true, dados: metodos });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const metodo = await MetodoModel.findById(req.params.id);
      if (!metodo) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório' });
      const metodo = await MetodoModel.create({ nome, descricao });
      return res.status(201).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const metodo = await MetodoModel.update(req.params.id, req.body);
      if (!metodo) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const deletado = await MetodoModel.delete(req.params.id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, mensagem: 'Método removido' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = MetodoController;
EOF

log_success "Controllers criados (auth, usuario, conta, transacao, categoria, metodo)"

# =============================================================================
# ETAPA 7: Criar Routes
# =============================================================================
log_step "Criando Rotas"

# ─── routes/authRoutes.js ─────────────────────────────────────────────────────
cat > routes/authRoutes.js << 'EOF'
// =============================================================================
// routes/authRoutes.js
// Rotas de autenticação
// =============================================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// POST /auth/registro  — Registrar novo usuário
router.post('/registro', AuthController.registro);

// POST /auth/login     — Autenticar usuário
router.post('/login', AuthController.login);

// GET  /auth/me        — Dados do usuário logado
router.get('/me', AuthController.me);

module.exports = router;
EOF

# ─── routes/usuarioRoutes.js ──────────────────────────────────────────────────
cat > routes/usuarioRoutes.js << 'EOF'
// =============================================================================
// routes/usuarioRoutes.js
// CRUD de usuários
// =============================================================================

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.get('/',     UsuarioController.listar);
router.get('/:id',  UsuarioController.buscarPorId);
router.put('/:id',  UsuarioController.atualizar);
router.delete('/:id', UsuarioController.deletar);

module.exports = router;
EOF

# ─── routes/contaRoutes.js ────────────────────────────────────────────────────
cat > routes/contaRoutes.js << 'EOF'
// =============================================================================
// routes/contaRoutes.js
// CRUD de contas bancárias
// =============================================================================

const express = require('express');
const router = express.Router();
const ContaController = require('../controllers/contaController');

router.get('/',       ContaController.listar);
router.get('/:id',    ContaController.buscarPorId);
router.post('/',      ContaController.criar);
router.put('/:id',    ContaController.atualizar);
router.delete('/:id', ContaController.deletar);

module.exports = router;
EOF

# ─── routes/transacaoRoutes.js ────────────────────────────────────────────────
cat > routes/transacaoRoutes.js << 'EOF'
// =============================================================================
// routes/transacaoRoutes.js
// CRUD de transações + resumo financeiro
// =============================================================================

const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/transacaoController');

router.get('/resumo', TransacaoController.resumo);  // deve vir antes de /:id
router.get('/',       TransacaoController.listar);
router.get('/:id',    TransacaoController.buscarPorId);
router.post('/',      TransacaoController.criar);
router.put('/:id',    TransacaoController.atualizar);
router.delete('/:id', TransacaoController.deletar);

module.exports = router;
EOF

# ─── routes/categoriaRoutes.js ────────────────────────────────────────────────
cat > routes/categoriaRoutes.js << 'EOF'
// =============================================================================
// routes/categoriaRoutes.js
// CRUD de categorias
// =============================================================================

const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoriaController');

router.get('/',       CategoriaController.listar);
router.get('/:id',    CategoriaController.buscarPorId);
router.post('/',      CategoriaController.criar);
router.put('/:id',    CategoriaController.atualizar);
router.delete('/:id', CategoriaController.deletar);

module.exports = router;
EOF

# ─── routes/metodoRoutes.js ───────────────────────────────────────────────────
cat > routes/metodoRoutes.js << 'EOF'
// =============================================================================
// routes/metodoRoutes.js
// CRUD de métodos de pagamento
// =============================================================================

const express = require('express');
const router = express.Router();
const MetodoController = require('../controllers/metodoController');

router.get('/',       MetodoController.listar);
router.get('/:id',    MetodoController.buscarPorId);
router.post('/',      MetodoController.criar);
router.put('/:id',    MetodoController.atualizar);
router.delete('/:id', MetodoController.deletar);

module.exports = router;
EOF

log_success "Rotas criadas (auth, usuarios, contas, transacoes, categorias, metodos)"

# =============================================================================
# ETAPA 8: Criar server/index.js (ponto de entrada)
# =============================================================================
log_step "Criando server/index.js (ponto de entrada)"

cat > server/index.js << 'EOF'
// =============================================================================
// server/index.js
// Ponto de entrada do servidor FinControl
// =============================================================================

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { testConnection } = require('../config/database');

// ─── Importar Rotas ──────────────────────────────────────────────────────────
const authRoutes      = require('../routes/authRoutes');
const usuarioRoutes   = require('../routes/usuarioRoutes');
const contaRoutes     = require('../routes/contaRoutes');
const transacaoRoutes = require('../routes/transacaoRoutes');
const categoriaRoutes = require('../routes/categoriaRoutes');
const metodoRoutes    = require('../routes/metodoRoutes');

// ─── Configuração do App ─────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares Globais ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-usuario-id'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Middleware de Log de Requisições ────────────────────────────────────────
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ─── Rota de Saúde ───────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    projeto: 'FinControl API',
    versao:  '1.0.0',
    status:  'online',
    rotas: ['/auth', '/usuarios', '/contas', '/transacoes', '/categorias', '/metodos'],
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Registrar Rotas ─────────────────────────────────────────────────────────
app.use('/auth',       authRoutes);
app.use('/usuarios',   usuarioRoutes);
app.use('/contas',     contaRoutes);
app.use('/transacoes', transacaoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/metodos',    metodoRoutes);

// ─── Middleware 404 ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ sucesso: false, mensagem: 'Rota não encontrada' });
});

// ─── Middleware de Erro Global ────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
});

// ─── Inicializar Servidor ────────────────────────────────────────────────────
const iniciar = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 FinControl API rodando!');
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('📋 Rotas disponíveis:');
      console.log(`   GET  http://localhost:${PORT}/`);
      console.log(`   POST http://localhost:${PORT}/auth/registro`);
      console.log(`   POST http://localhost:${PORT}/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/transacoes/resumo`);
      console.log('');
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  }
};

iniciar();
EOF

log_success "server/index.js criado"

# =============================================================================
# ETAPA 9: SQL de criação das tabelas (referência)
# =============================================================================
log_step "Criando script SQL de referência"

mkdir -p config

cat > config/schema.sql << 'EOF'
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
EOF

log_success "config/schema.sql criado (execute no Neon para criar as tabelas)"

# Voltar para raiz do projeto
cd ../..

# =============================================================================
# ETAPA 10: Criar Frontend com Vite + React
# =============================================================================
log_step "Criando Frontend com Vite + React"

cd FinControl/frontend

# Criar projeto Vite React
log_info "Inicializando projeto Vite..."
npm create vite@latest . -- --template react --yes > /dev/null 2>&1 || \
  npx create-vite@latest . --template react > /dev/null 2>&1

log_info "Instalando dependências do frontend..."
npm install > /dev/null 2>&1

log_info "Instalando axios..."
npm install axios > /dev/null 2>&1

log_success "Frontend Vite + React inicializado"

# ─── .env do frontend ─────────────────────────────────────────────────────────
cat > .env << 'EOF'
# FinControl — Frontend Environment
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=FinControl
EOF

cat > .env.example << 'EOF'
# FinControl — Frontend Environment (exemplo)
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=FinControl
EOF

# ─── src/services/api.js ──────────────────────────────────────────────────────
mkdir -p src/services

cat > src/services/api.js << 'EOF'
// =============================================================================
// src/services/api.js
// Instância do Axios configurada para a API do FinControl
// =============================================================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptor de Requisição ────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fincontrol_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Envia usuario_id no header (remover ao implementar JWT completo)
    const usuarioId = localStorage.getItem('fincontrol_usuario_id');
    if (usuarioId) {
      config.headers['x-usuario-id'] = usuarioId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de Resposta ──────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fincontrol_token');
      localStorage.removeItem('fincontrol_usuario_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Serviços por recurso ─────────────────────────────────────────────────────

export const authService = {
  login:    (dados) => api.post('/auth/login', dados),
  registro: (dados) => api.post('/auth/registro', dados),
  me:       ()      => api.get('/auth/me'),
};

export const contaService = {
  listar:       ()       => api.get('/contas'),
  buscar:       (id)     => api.get(`/contas/${id}`),
  criar:        (dados)  => api.post('/contas', dados),
  atualizar:    (id, d)  => api.put(`/contas/${id}`, d),
  deletar:      (id)     => api.delete(`/contas/${id}`),
};

export const transacaoService = {
  listar:   (params) => api.get('/transacoes', { params }),
  buscar:   (id)     => api.get(`/transacoes/${id}`),
  criar:    (dados)  => api.post('/transacoes', dados),
  atualizar:(id, d)  => api.put(`/transacoes/${id}`, d),
  deletar:  (id)     => api.delete(`/transacoes/${id}`),
  resumo:   ()       => api.get('/transacoes/resumo'),
};

export const categoriaService = {
  listar:   ()       => api.get('/categorias'),
  criar:    (dados)  => api.post('/categorias', dados),
  atualizar:(id, d)  => api.put(`/categorias/${id}`, d),
  deletar:  (id)     => api.delete(`/categorias/${id}`),
};

export const metodoService = {
  listar: () => api.get('/metodos'),
  criar:  (d) => api.post('/metodos', d),
};

export default api;
EOF

# ─── src/hooks/useAuth.js ─────────────────────────────────────────────────────
mkdir -p src/hooks

cat > src/hooks/useAuth.js << 'EOF'
// =============================================================================
// src/hooks/useAuth.js
// Hook de autenticação
// =============================================================================

import { useState, useCallback } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('fincontrol_usuario');
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const login = useCallback(async ({ email, senha }) => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await authService.login({ email, senha });
      if (data.sucesso) {
        localStorage.setItem('fincontrol_token', data.token);
        localStorage.setItem('fincontrol_usuario_id', data.usuario.id);
        localStorage.setItem('fincontrol_usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);
        return { sucesso: true };
      }
    } catch (err) {
      const mensagem = err.response?.data?.mensagem || 'Erro ao fazer login';
      setErro(mensagem);
      return { sucesso: false, mensagem };
    } finally {
      setCarregando(false);
    }
  }, []);

  const registro = useCallback(async ({ nome, email, senha }) => {
    setCarregando(true);
    setErro(null);
    try {
      const { data } = await authService.registro({ nome, email, senha });
      return { sucesso: data.sucesso };
    } catch (err) {
      const mensagem = err.response?.data?.mensagem || 'Erro ao registrar';
      setErro(mensagem);
      return { sucesso: false, mensagem };
    } finally {
      setCarregando(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fincontrol_token');
    localStorage.removeItem('fincontrol_usuario_id');
    localStorage.removeItem('fincontrol_usuario');
    setUsuario(null);
  }, []);

  return { usuario, carregando, erro, login, registro, logout };
};
EOF

# ─── src/pages/Login.jsx ──────────────────────────────────────────────────────
mkdir -p src/pages

cat > src/pages/Login.jsx << 'EOF'
// =============================================================================
// src/pages/Login.jsx
// Página de Login do FinControl
// =============================================================================

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, carregando, erro } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(form);
    if (resultado?.sucesso) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <p style={styles.subtitulo}>Faça login na sua conta</p>

        {erro && <div style={styles.erro}>{erro}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            style={styles.input}
          />

          <label style={styles.label}>Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="••••••••"
            required
            style={styles.input}
          />

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={styles.link}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card:      { background: '#1e293b', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  titulo:    { color: '#38bdf8', fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
  subtitulo: { color: '#94a3b8', marginBottom: '1.5rem' },
  form:      { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label:     { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 },
  input:     { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem' },
  botao:     { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:      { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5', marginBottom: '1rem' },
  link:      { color: '#94a3b8', textAlign: 'center', marginTop: '1.25rem' },
};
EOF

# ─── src/pages/Cadastro.jsx ───────────────────────────────────────────────────
cat > src/pages/Cadastro.jsx << 'EOF'
// =============================================================================
// src/pages/Cadastro.jsx
// Página de Cadastro do FinControl
// =============================================================================

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Cadastro() {
  const { registro, carregando, erro } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await registro(form);
    if (resultado?.sucesso) {
      setSucesso(true);
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <p style={styles.subtitulo}>Crie sua conta gratuita</p>

        {erro    && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>Conta criada! Redirecionando...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nome completo</label>
          <input type="text"     name="nome"  value={form.nome}  onChange={handleChange} placeholder="João Silva"          required style={styles.input} />
          <label style={styles.label}>E-mail</label>
          <input type="email"    name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com"       required style={styles.input} />
          <label style={styles.label}>Senha</label>
          <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" required minLength={6} style={styles.input} />

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p style={styles.link}>
          Já tem conta? <a href="/login">Entrar</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card:      { background: '#1e293b', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 400, boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  titulo:    { color: '#38bdf8', fontSize: '2rem', fontWeight: 800, marginBottom: 4 },
  subtitulo: { color: '#94a3b8', marginBottom: '1.5rem' },
  form:      { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label:     { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 },
  input:     { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem' },
  botao:     { background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '0.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:      { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5', marginBottom: '1rem' },
  sucesso:   { background: '#052e16', border: '1px solid #22c55e', borderRadius: 8, padding: '0.75rem', color: '#86efac', marginBottom: '1rem' },
  link:      { color: '#94a3b8', textAlign: 'center', marginTop: '1.25rem' },
};
EOF

# ─── src/pages/Dashboard.jsx ─────────────────────────────────────────────────
cat > src/pages/Dashboard.jsx << 'EOF'
// =============================================================================
// src/pages/Dashboard.jsx
// Dashboard principal do FinControl
// =============================================================================

import { useState, useEffect } from 'react';
import { transacaoService, contaService } from '../services/api';

export default function Dashboard() {
  const [resumo, setResumo]         = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas]         = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resResumo, resTrans, resContas] = await Promise.all([
          transacaoService.resumo(),
          transacaoService.listar({ limit: 5 }),
          contaService.listar(),
        ]);
        setResumo(resResumo.data.dados);
        setTransacoes(resTrans.data.dados || []);
        setContas(resContas.data.dados || []);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err.message);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  if (carregando) return <div style={styles.loading}>⏳ Carregando dados...</div>;

  const saldo = (resumo?.total_receitas || 0) - (resumo?.total_despesas || 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>💰 FinControl</h1>
        <nav style={styles.nav}>
          <a href="/nova-transacao" style={styles.navLink}>+ Nova Transação</a>
          <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} style={styles.btnLogout}>Sair</button>
        </nav>
      </header>

      {/* Cards de resumo */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, borderTop: '3px solid #22c55e' }}>
          <p style={styles.cardLabel}>Total Receitas</p>
          <p style={{ ...styles.cardValor, color: '#22c55e' }}>{fmt(resumo?.total_receitas)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #ef4444' }}>
          <p style={styles.cardLabel}>Total Despesas</p>
          <p style={{ ...styles.cardValor, color: '#ef4444' }}>{fmt(resumo?.total_despesas)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #38bdf8' }}>
          <p style={styles.cardLabel}>Saldo</p>
          <p style={{ ...styles.cardValor, color: saldo >= 0 ? '#22c55e' : '#ef4444' }}>{fmt(saldo)}</p>
        </div>
        <div style={{ ...styles.card, borderTop: '3px solid #a78bfa' }}>
          <p style={styles.cardLabel}>Transações</p>
          <p style={{ ...styles.cardValor, color: '#a78bfa' }}>{resumo?.total_transacoes || 0}</p>
        </div>
      </div>

      {/* Últimas transações */}
      <div style={styles.secao}>
        <h2 style={styles.secaoTitulo}>Últimas Transações</h2>
        {transacoes.length === 0 ? (
          <p style={styles.vazio}>Nenhuma transação registrada ainda.</p>
        ) : (
          <div style={styles.lista}>
            {transacoes.map((t) => (
              <div key={t.id} style={styles.item}>
                <div>
                  <p style={styles.itemDesc}>{t.descricao || 'Sem descrição'}</p>
                  <p style={styles.itemData}>{new Date(t.data).toLocaleDateString('pt-BR')} · {t.categoria_nome || 'Sem categoria'}</p>
                </div>
                <p style={{ ...styles.itemValor, color: t.tipo === 'receita' ? '#22c55e' : '#ef4444' }}>
                  {t.tipo === 'receita' ? '+' : '-'}{fmt(t.valor)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contas */}
      <div style={styles.secao}>
        <h2 style={styles.secaoTitulo}>Minhas Contas ({contas.length})</h2>
        {contas.length === 0 ? (
          <p style={styles.vazio}>Nenhuma conta cadastrada.</p>
        ) : (
          <div style={styles.contasGrid}>
            {contas.map((c) => (
              <div key={c.id} style={styles.contaCard}>
                <p style={styles.contaNome}>{c.nome}</p>
                <p style={styles.contaTipo}>{c.tipo}</p>
                <p style={styles.contaSaldo}>{fmt(c.saldo_atual)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container:   { minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'system-ui, sans-serif' },
  loading:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#94a3b8', fontSize: '1.25rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1e293b', borderBottom: '1px solid #334155' },
  titulo:      { color: '#38bdf8', fontSize: '1.5rem', fontWeight: 800, margin: 0 },
  nav:         { display: 'flex', gap: '1rem', alignItems: 'center' },
  navLink:     { color: '#38bdf8', textDecoration: 'none', fontWeight: 600, background: '#0f172a', padding: '0.5rem 1rem', borderRadius: 8 },
  btnLogout:   { background: 'transparent', border: '1px solid #475569', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: 8, cursor: 'pointer' },
  cards:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '2rem' },
  card:        { background: '#1e293b', borderRadius: 12, padding: '1.5rem' },
  cardLabel:   { color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem' },
  cardValor:   { fontSize: '1.75rem', fontWeight: 800, margin: 0 },
  secao:       { padding: '0 2rem 2rem' },
  secaoTitulo: { color: '#e2e8f0', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' },
  vazio:       { color: '#475569', fontStyle: 'italic' },
  lista:       { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  item:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', borderRadius: 10, padding: '1rem 1.25rem' },
  itemDesc:    { color: '#e2e8f0', fontWeight: 600, margin: 0 },
  itemData:    { color: '#64748b', fontSize: '0.8rem', margin: '0.25rem 0 0' },
  itemValor:   { fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  contasGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },
  contaCard:   { background: '#1e293b', borderRadius: 10, padding: '1.25rem', borderLeft: '3px solid #3b82f6' },
  contaNome:   { color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.25rem' },
  contaTipo:   { color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.75rem', textTransform: 'capitalize' },
  contaSaldo:  { color: '#38bdf8', fontWeight: 800, fontSize: '1.1rem', margin: 0 },
};
EOF

# ─── src/pages/NovaTransacao.jsx ─────────────────────────────────────────────
cat > src/pages/NovaTransacao.jsx << 'EOF'
// =============================================================================
// src/pages/NovaTransacao.jsx
// Formulário para registrar nova transação
// =============================================================================

import { useState, useEffect } from 'react';
import { transacaoService, categoriaService, contaService, metodoService } from '../services/api';

export default function NovaTransacao() {
  const [form, setForm] = useState({
    tipo: 'despesa', descricao: '', valor: '', data: new Date().toISOString().slice(0, 10),
    conta_id: '', categoria_id: '', metodo_id: '',
  });
  const [categorias, setCategorias] = useState([]);
  const [contas, setContas]         = useState([]);
  const [metodos, setMetodos]       = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso]       = useState(false);
  const [erro, setErro]             = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [resCat, resContas, resMet] = await Promise.all([
          categoriaService.listar(),
          contaService.listar(),
          metodoService.listar(),
        ]);
        setCategorias(resCat.data.dados   || []);
        setContas(resContas.data.dados    || []);
        setMetodos(resMet.data.dados      || []);
      } catch (err) {
        console.error('Erro ao carregar dados:', err.message);
      }
    };
    carregar();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      await transacaoService.criar({
        ...form,
        valor:       parseFloat(form.valor),
        conta_id:    form.conta_id    || null,
        categoria_id:form.categoria_id|| null,
        metodo_id:   form.metodo_id   || null,
      });
      setSucesso(true);
      setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
    } catch (err) {
      setErro(err.response?.data?.mensagem || 'Erro ao salvar transação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <a href="/dashboard" style={styles.voltar}>← Voltar</a>
        <h1 style={styles.titulo}>Nova Transação</h1>

        {erro    && <div style={styles.erro}>{erro}</div>}
        {sucesso && <div style={styles.sucesso}>✅ Transação salva! Redirecionando...</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Tipo */}
          <div style={styles.tipoSwitch}>
            {['despesa', 'receita'].map((t) => (
              <button key={t} type="button"
                style={{ ...styles.tipoBotao, ...(form.tipo === t ? (t === 'receita' ? styles.ativo_receita : styles.ativo_despesa) : {}) }}
                onClick={() => setForm({ ...form, tipo: t })}>
                {t === 'receita' ? '📈 Receita' : '📉 Despesa'}
              </button>
            ))}
          </div>

          <label style={styles.label}>Descrição</label>
          <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Aluguel, Salário..." style={styles.input} />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Valor (R$)</label>
              <input type="number" name="valor" value={form.valor} onChange={handleChange} placeholder="0,00" step="0.01" min="0.01" required style={styles.input} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Data</label>
              <input type="date" name="data" value={form.data} onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <label style={styles.label}>Categoria</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.icone} {c.nome}</option>)}
          </select>

          <label style={styles.label}>Conta</label>
          <select name="conta_id" value={form.conta_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {contas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <label style={styles.label}>Método de Pagamento</label>
          <select name="metodo_id" value={form.metodo_id} onChange={handleChange} style={styles.select}>
            <option value="">Selecione (opcional)</option>
            {metodos.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? 'Salvando...' : '💾 Salvar Transação'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container:     { minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  card:          { background: '#1e293b', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 560 },
  voltar:        { color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' },
  titulo:        { color: '#f1f5f9', fontSize: '1.75rem', fontWeight: 800, margin: '0.75rem 0 1.5rem' },
  form:          { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label:         { color: '#cbd5e1', fontSize: '0.875rem', fontWeight: 600 },
  input:         { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  select:        { background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '0.75rem', color: '#f1f5f9', fontSize: '1rem' },
  botao:         { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  erro:          { background: '#450a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '0.75rem', color: '#fca5a5' },
  sucesso:       { background: '#052e16', border: '1px solid #22c55e', borderRadius: 8, padding: '0.75rem', color: '#86efac' },
  tipoSwitch:    { display: 'flex', gap: '0.5rem' },
  tipoBotao:     { flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '1rem' },
  ativo_receita: { background: '#052e16', border: '1px solid #22c55e', color: '#22c55e' },
  ativo_despesa: { background: '#450a0a', border: '1px solid #ef4444', color: '#ef4444' },
  row:           { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  col:           { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
};
EOF

# ─── src/App.jsx ──────────────────────────────────────────────────────────────
cat > src/App.jsx << 'EOF'
// =============================================================================
// src/App.jsx
// Roteamento simples baseado em pathname
// =============================================================================

import Login         from './pages/Login';
import Cadastro      from './pages/Cadastro';
import Dashboard     from './pages/Dashboard';
import NovaTransacao from './pages/NovaTransacao';

function App() {
  const path = window.location.pathname;

  if (path === '/cadastro')       return <Cadastro />;
  if (path === '/dashboard')      return <Dashboard />;
  if (path === '/nova-transacao') return <NovaTransacao />;
  return <Login />;
}

export default App;
EOF

# ─── src/main.jsx ─────────────────────────────────────────────────────────────
cat > src/main.jsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Reset global mínimo
const style = document.createElement('style');
style.textContent = `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: system-ui, -apple-system, sans-serif; } a { color: #38bdf8; }`;
document.head.appendChild(style);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

log_success "Frontend: páginas Login, Cadastro, Dashboard e NovaTransação criadas"

# Voltar ao root
cd ../..

# =============================================================================
# ETAPA 11: Criar README.md
# =============================================================================
log_step "Criando README.md"

cat > FinControl/README.md << 'EOF'
# 💰 FinControl — Controle Financeiro Pessoal

Sistema fullstack de controle financeiro pessoal com Node.js, Express, PostgreSQL (Neon) e React + Vite.

---

## 🏗️ Estrutura do Projeto

```
FinControl/
├── backend/
│   ├── server/index.js          # Ponto de entrada do servidor
│   ├── routes/                  # Definição de rotas
│   ├── controllers/             # Regras de negócio
│   ├── models/                  # Queries SQL
│   ├── config/
│   │   ├── database.js          # Conexão com Neon (SSL)
│   │   └── schema.sql           # DDL para criar tabelas
│   ├── .env                     # Variáveis de ambiente (não commitar!)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/               # Login, Cadastro, Dashboard, NovaTransação
    │   ├── services/api.js      # Axios + serviços por recurso
    │   ├── hooks/useAuth.js     # Hook de autenticação
    │   └── App.jsx              # Roteamento simples
    └── package.json
```

---

## 🚀 Como executar

### 1. Criar as tabelas no banco (apenas uma vez)

Acesse o **Neon Console** → SQL Editor e execute o conteúdo de:
```
backend/config/schema.sql
```

### 2. Backend

```bash
cd backend
npm run dev        # Desenvolvimento com nodemon (porta 3000)
# ou
npm start          # Produção
```

### 3. Frontend

```bash
cd frontend
npm run dev        # Vite (porta 5173)
```

---

## 🔗 Rotas da API

| Método | Rota                    | Descrição                  |
|--------|-------------------------|----------------------------|
| POST   | /auth/registro          | Criar conta                |
| POST   | /auth/login             | Autenticar usuário         |
| GET    | /usuarios               | Listar usuários            |
| GET    | /contas                 | Listar contas              |
| POST   | /contas                 | Criar conta                |
| GET    | /transacoes             | Listar transações          |
| GET    | /transacoes/resumo      | Resumo financeiro          |
| POST   | /transacoes             | Criar transação            |
| GET    | /categorias             | Listar categorias          |
| GET    | /metodos                | Listar métodos             |

---

## 🌐 Banco de Dados (Neon)

- **Host:** ep-purple-rice-amji35uy-pooler.c-5.us-east-1.aws.neon.tech
- **Banco:** neondb
- **SSL:** ativado (rejectUnauthorized: false)
- Conexão via `pg.Pool` — configurada em `backend/config/database.js`

---

## 📦 Dependências

### Backend
- `express` — framework HTTP
- `pg` — cliente PostgreSQL
- `dotenv` — variáveis de ambiente
- `cors` — controle de origem
- `nodemon` — recarregamento automático (dev)

### Frontend
- `react` + `vite` — framework e bundler
- `axios` — requisições HTTP

---

## ⚠️ Próximos passos

- [ ] Implementar JWT completo (`jsonwebtoken`)
- [ ] Adicionar bcrypt para hash de senhas
- [ ] Implementar middleware de autenticação
- [ ] Adicionar React Router DOM para navegação
- [ ] Criar componentes reutilizáveis
- [ ] Configurar variáveis de ambiente no servidor de produção

---

> Gerado automaticamente por `setup.sh` — FinControl v1.0.0
EOF

log_success "README.md criado"

# =============================================================================
# ETAPA 12: Resumo final
# =============================================================================
log_step "✅ Setup concluído!"

echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║          🎉 FinControl configurado com sucesso!          ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}📁 Projeto criado em:${NC} ./FinControl/"
echo ""
echo -e "${BOLD}🗄️  PASSO 1 — Criar tabelas no Neon:${NC}"
echo -e "   Acesse o Neon Console e execute:"
echo -e "   ${CYAN}backend/config/schema.sql${NC}"
echo ""
echo -e "${BOLD}⚙️  PASSO 2 — Iniciar o backend:${NC}"
echo -e "   ${CYAN}cd FinControl/backend && npm run dev${NC}"
echo -e "   URL: http://localhost:3000"
echo ""
echo -e "${BOLD}🎨 PASSO 3 — Iniciar o frontend:${NC}"
echo -e "   ${CYAN}cd FinControl/frontend && npm run dev${NC}"
echo -e "   URL: http://localhost:5173"
echo ""
echo -e "${BOLD}📋 Rotas disponíveis:${NC}"
echo -e "   /auth  /usuarios  /contas  /transacoes  /categorias  /metodos"
echo ""
echo -e "${YELLOW}⚠️  Não esqueça de criar as tabelas antes de testar a API!${NC}"
echo ""
EOF

chmod +x /mnt/user-data/outputs/setup.sh
