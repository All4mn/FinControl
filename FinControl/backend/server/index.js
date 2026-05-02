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
