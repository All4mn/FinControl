export class TransacaoController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para evitar perda de contexto nas rotas
    this.listar = this.listar.bind(this);
    this.archive = this.archive.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const transacoes = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: transacoes });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async archive(req, res) {
    try {
      const { id } = req.params;
      const transacao = await this.service.archive(id);
      if (!transacao)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const transacao = await this.service.findById(id);
      if (!transacao)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaTransacao = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaTransacao });
    } catch (err) {
      console.error("ERRO AO CRIAR TRANSAÇÃO:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const transacao = await this.service.update(id, req.body);
      if (!transacao)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.service.delete(id);
      if (!deletado)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Transação não encontrada" });
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Transação removida" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
