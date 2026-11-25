import dotenv from "dotenv";

dotenv.config();

export function requireEnv(nome) {
  const valor = process.env[nome];
  if (valor === undefined || valor === "") {
    throw new Error(`Variável de ambiente obrigatória não configurada: ${nome}`);
  }
  return valor;
}

export function optionalEnv(nome, padrao) {
  const valor = process.env[nome];
  return valor === undefined || valor === "" ? padrao : valor;
}

export function databaseUrl() {
  const valor = process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING;
  if (!valor) {
    throw new Error(
      "Defina DATABASE_URL ou DB_CONNECTION_STRING para conectar ao PostgreSQL.",
    );
  }
  return valor;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
