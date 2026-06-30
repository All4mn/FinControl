// =============================================================================
// app.js
// =============================================================================

import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";

// Importando as rotas do Fastify
import { usuarioRoutes } from "./features/usuario/usuarioRoutes.js";
import { categoriaRoutes } from "./features/categoria/categoriaRoutes.js";
import { metodoRoutes } from "./features/metodo/metodoRoutes.js";
import { contaRoutes } from "./features/conta/contaRoutes.js";
import { carteiraRoutes } from "./features/carteira/carteiraRoutes.js";
import { transacaoRoutes } from "./features/transacao/transacaoRoutes.js";
import { statusUsuarioRoutes } from "./features/status_usuario/statusUsuarioRoutes.js";
import { logsRoutes } from "./features/logs/logsRoutes.js";
import { AppError } from "./Errors/AppError.js";

dotenv.config();

const app = fastify({ logger: true });

// Tratamento de erros global
app.setErrorHandler((error, request, reply) => {
  // Verifica se o erro foi intencional (Regra de Negócio / Validação)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
    });
  }
  // Se o erro NÃO for um AppError, é um erro inesperado
  // (ex: banco de dados caiu, digitação errada no código).
  console.error("🔥 ERRO INTERNO:", error);
  return reply.status(500).send({
    status: "error",
    message: "Internal Server Error",
  });
});

app.register(cookie, {
  secret: process.env.COOKIE_SECRET || "cookie-secret-change-me",
});

app.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Registra as rotas com seus prefixos.
// Ex: Tudo que estiver em usuarioRoutes será acessado via /usuarios
app.register(usuarioRoutes, { prefix: "/usuarios" });
app.register(categoriaRoutes, { prefix: "/categorias" });
app.register(metodoRoutes, { prefix: "/metodos" });
app.register(contaRoutes, { prefix: "/contas" });
app.register(carteiraRoutes, { prefix: "/carteiras" });
app.register(transacaoRoutes, { prefix: "/transacoes" });
app.register(logsRoutes, { prefix: "/logs" });
app.register(statusUsuarioRoutes, { prefix: "/status-usuario" });

app.get("/", async () => {
  return { status: "online" };
});

const start = async () => {
  try {
    console.log("Conectando ao banco de dados...");
    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    console.log("Servidor conectado ao banco de dados com sucesso!");
    console.log(
      `Servidor Fastify rodando na porta: ${process.env.PORT || 3000}`,
    );
    // console.log(process.env.DB_CONNECTION_STRING); // <-- Adicione esta linha para verificar a string de conexão se der undefined então falta configurar a variável de ambiente
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
