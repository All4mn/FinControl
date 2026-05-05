// =============================================================================
// app.js
// =============================================================================

import fastify from "fastify";
import cors from '@fastify/cors';
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

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
});

// Registra as rotas com seus prefixos.
// Ex: Tudo que estiver em usuarioRoutes será acessado via /usuarios
app.register(usuarioRoutes, { prefix: '/usuarios' });
app.register(categoriaRoutes, { prefix: '/categorias' });
app.register(metodoRoutes, { prefix: '/metodos' });
app.register(contaRoutes, { prefix: '/contas' });
app.register(transacaoRoutes, { prefix: '/transacoes' });
app.register(logsRoutes, { prefix: '/logs' });

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log("Servidor Fastify rodando na porta 3000");
        console.log("Conectando ao banco de dados...");
        // console.log(process.env.DB_CONNECTION_STRING); // <-- Adicione esta linha para verificar a string de conexão se der undefined então falta configurar a variável de ambiente
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();