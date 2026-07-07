// =============================================================================
// src/features/moeda/moeda.controller.js
// Gerencia fluxo de requisição e resposta para moeda
// =============================================================================

export class MoedaController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para evitar perda de contexto nas rotas
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const moedas = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: moedas });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const moeda = await this.service.findById(id);
      if (!moeda)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Moeda não encontrada" });
      return res.status(200).send({ sucesso: true, dados: moeda });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaMoeda = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaMoeda });
    } catch (err) {
      // Diferente do erro 500, usamos 400 ou repassamos a mensagem do service
      return res.status(400).send({ sucesso: false, mensagem: err.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const moeda = await this.service.update(id, req.body);
      if (!moeda)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Moeda não encontrada" });
      return res.status(200).send({ sucesso: true, dados: moeda });
    } catch (err) {
      return res.status(400).send({ sucesso: false, mensagem: err.message });
    }
  }

async deletar(req, res) {
  try {
    const { id } = req.params;
    const deletado = await this.service.delete(id);
    if (!deletado)
      return res
        .status(404)
        .send({ sucesso: false, mensagem: "Moeda não encontrada" });
    return res
      .status(200)
      .send({ sucesso: true, mensagem: "Moeda removida" });
  } catch (err) {
    // Alterado de 500 para 400 para expor a mensagem de validação do Service
    return res.status(400).send({ sucesso: false, mensagem: err.message });
  }
}
}