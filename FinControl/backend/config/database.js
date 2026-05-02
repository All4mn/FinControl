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
