import { AppError } from "../../Errors/AppError.js";

const responderErro = (reply, error, contexto) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      sucesso: false,
      mensagem: error.message,
    });
  }

  console.error(contexto, error);
  if (["ETIMEDOUT", "ECONNREFUSED", "ENETUNREACH", "ECONNRESET"].includes(error.code)) {
    return reply.status(503).send({
      sucesso: false,
      mensagem: "Banco de dados indisponível. Verifique a conexão e tente novamente.",
    });
  }

  return reply.status(500).send({
    sucesso: false,
    mensagem: "Não foi possível processar a transação. Tente novamente.",
  });
};

export class TransacaoController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para evitar perda de contexto nas rotas
    this.listar = this.listar.bind(this);
    this.listarArquivadas = this.listarArquivadas.bind(this);
    this.archive = this.archive.bind(this);
    this.restore = this.restore.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const transacoes = await this.service.findAll(req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, dados: transacoes });
    } catch (err) {
      return responderErro(res, err, "Erro ao listar transações:");
    }
  }

  async listarArquivadas(req, res) {
    try {
      const transacoes = await this.service.findArchived(req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, dados: transacoes });
    } catch (err) {
      return responderErro(res, err, "Erro ao listar transações arquivadas:");
    }
  }

  async archive(req, res) {
    try {
      const transacao = await this.service.archive(req.params.id, req.usuario.id_usuario);
      if (!transacao) {
        return res.status(404).send({ sucesso: false, mensagem: "Transação não encontrada" });
      }
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return responderErro(res, err, "Erro ao arquivar transação:");
    }
  }

  async restore(req, res) {
    try {
      const transacao = await this.service.restore(req.params.id, req.usuario.id_usuario);
      if (!transacao) {
        return res.status(404).send({ sucesso: false, mensagem: "Transação não encontrada" });
      }
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return responderErro(res, err, "Erro ao restaurar transação:");
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const transacao = await this.service.findById(id, req.usuario.id_usuario);
      if (!transacao)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return responderErro(res, err, "Erro ao buscar transação:");
    }
  }

  async criar(req, res) {
    try {
      const novaTransacao = await this.service.create(req.body, req.usuario.id_usuario);
      if (!novaTransacao)
        return res.status(400).send({ sucesso: false, mensagem: "Conta ou carteira inválida" });
      return res.status(201).send({ sucesso: true, dados: novaTransacao });
    } catch (err) {
      return responderErro(res, err, "Erro ao criar transação:");
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const transacao = await this.service.update(id, req.body, req.usuario.id_usuario);
      if (!transacao)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return responderErro(res, err, "Erro ao atualizar transação:");
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.service.delete(id, req.usuario.id_usuario);
      if (!deletado)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Transação removida" });
    } catch (err) {
      return responderErro(res, err, "Erro ao excluir transação:");
    }
  }
}
