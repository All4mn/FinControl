// =============================================================================
// init-db.js
// Script para inicializar o banco de dados com o schema
// =============================================================================

require('dotenv').config();
const fs = require('fs');
const { pool } = require('./config/database');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Inicializando banco de dados...');

    // Ler o arquivo schema.sql
    const schema = fs.readFileSync('./config/schema.sql', 'utf8');

    // Executar o schema completo
    await pool.query(schema);

    console.log('✅ Banco de dados inicializado com sucesso!');
    console.log('📊 Tabelas criadas:');
    console.log('   - usuarios');
    console.log('   - metodos');
    console.log('   - categorias');
    console.log('   - contas');
    console.log('   - transacoes');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao inicializar banco de dados:', err.message);
    process.exit(1);
  }
};

initializeDatabase();
