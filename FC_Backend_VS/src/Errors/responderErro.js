// Respostas de erro padronizadas. conta.controller.js usava isso antes só
// via try/catch ausente: falhas do Postgres viravam 500 "Internal Server Error"
// sem dizer ao usuário o que fazer.
import { AppError } from "./AppError.js";

// "O banco não respondeu agora" e não "requisição errada". O Neon suspendendo o
// compute após inatividade aparecia como erro interno e travava a tela.
const CODIGOS_BANCO_INDISPONIVEL = [
  "ETIMEDOUT",
  "ECONNREFUSED",
  "ENETUNREACH",
  "ECONNRESET",
  "EPIPE",
  "EHOSTUNREACH",
  "ENOTFOUND",
  "57P01", // admin_shutdown
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now
  "53300", // too_many_connections
  "53400", // configuration_limit_exceeded
];

const ehBancoIndisponivel = (erro) =>
  Boolean(erro && CODIGOS_BANCO_INDISPONIVEL.includes(erro.code));

/**
 * @param {object} reply  objeto de resposta do Fastify
 * @param {Error}  erro   exceção capturada no controller
 * @param {string} contexto prefixo do log no console
 * @param {string} mensagemPadrao texto de fallback para erros desconhecidos
 */
export function responderErro(reply, erro, contexto, mensagemPadrao = "Erro interno") {
  if (erro instanceof AppError) {
    return reply.status(erro.statusCode).send({
      sucesso: false,
      mensagem: erro.message,
    });
  }

  console.error(contexto, erro);

  if (ehBancoIndisponivel(erro)) {
    return reply.status(503).send({
      sucesso: false,
      mensagem: "Banco de dados indisponível. Verifique a conexão e tente novamente.",
    });
  }

  // Contenção real entre requisições: o lock_timeout agora interrompe antes, então
// chegar aqui significa que vale pedir nova tentativa ao usuário.
  const codigo = erro && erro.code;
  if (codigo === "55P03" || codigo === "57014" || codigo === "40P01") {
    return reply.status(503).send({
      sucesso: false,
      mensagem: "O banco de dados está ocupado com outra operação. Tente novamente em instantes.",
    });
  }

  // Mesmo envelope { status, message } do handler global em app.js, mais
  // "mensagem" porque o frontend da equipe lê data.mensagem.
  return reply.status(500).send({
    status: "error",
    message: "Internal Server Error",
    mensagem: mensagemPadrao,
  });
}
