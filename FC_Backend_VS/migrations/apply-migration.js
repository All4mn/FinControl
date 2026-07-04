import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;
const sqlPath = path.resolve('migrations/2026-07-04-add-ativo-to-carteira.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING, ssl: { rejectUnauthorized: false } });

const applyMigration = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Migração aplicada com sucesso');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro na migração:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

applyMigration().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
