import fastify from "fastify";
import cors from '@fastify/cors';

import { routes } from "./routes/routes.js";
import dotenv from "dotenv";
dotenv.config();


const teste = process.env.DB_CONNECTION_STRING;

// Inicializa o servidor Fastify com logger habilitado para debug.
// Fastify é um framework web rápido e leve para Node.js, similar ao Express,
// mas com melhor performance e validação automática.
// Para replicar: Instale fastify via npm, importe e configure opções como logger.
const app = fastify(
    {logger: true}
);


// Registra o plugin CORS para permitir requisições de origens diferentes.
// Configurado para aceitar qualquer origem (*), métodos comuns (GET, POST, etc.),
// headers necessários e credentials (cookies/autenticação).
// Para replicar: Ajuste origin para domínios específicos em produção para segurança.
app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
});

// Registra as rotas definidas no arquivo routes.js.
// Isso modulariza o código, separando a configuração do servidor das definições de rotas.
// Para replicar: Crie um arquivo routes.js e registre-o aqui.
app.register(routes);

// Função assíncrona para iniciar o servidor.
// Tenta escutar na porta 3000, loga sucesso ou erro.
// Em caso de erro, sai do processo com código 1.
// Para replicar: Mude a porta se necessário, adicione mais configurações como host.
const start = async () => {
    try {

        await app.listen({port: 3000});
        console.log("Servidor rodando na porta 3000");
        console.log("String de conexão com o banco de dados:", teste);

    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// Chama a função start para iniciar o servidor.
// Para replicar: Em projetos maiores, considere graceful shutdown ou clustering.
start();