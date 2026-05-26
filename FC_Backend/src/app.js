// =============================================================================
// app.js
// =============================================================================

import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import dotenv from "dotenv";

// Importando as rotas do Fastify
import { usuarioRoutes } from "./routes/usuarioRoutes.js";
import { categoriaRoutes } from "./routes/categoriaRoutes.js";
import { metodoRoutes } from "./routes/metodoRoutes.js";
import { contaRoutes } from "./routes/contaRoutes.js";
import { transacaoRoutes } from "./routes/transacaoRoutes.js";
import { logsRoutes } from "./routes/logsRoutes.js";

dotenv.config();

const app = fastify({ logger: true });

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
app.register(transacaoRoutes, { prefix: "/transacoes" });
app.register(logsRoutes, { prefix: "/logs" });

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
    console.log("Servidor Fastify rodando na porta:");
    // console.log(process.env.DB_CONNECTION_STRING); // <-- Adicione esta linha para verificar a string de conexão se der undefined então falta configurar a variável de ambiente
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
