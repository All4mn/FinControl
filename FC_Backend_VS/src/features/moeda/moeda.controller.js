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
      const moedas = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: moedas })
  }

  async buscarPorId(req, res) {
      const { id } = req.params;
      const moeda = await this.service.findById(id);
      return res.status(200).send({ sucesso: true, dados: moeda });
  }

  async criar(req, res) {
      const { nome_moeda } = req.body;
      const novaMoeda = await this.service.create(nome_moeda);
      return res.status(201).send({ sucesso: true, dados: novaMoeda });
    
  }

  async atualizar(req, res) {
      const { id } = req.params;
      const { nome_moeda } = req.body;
      const moeda = await this.service.update(id, nome_moeda);
      return res.status(200).send({ sucesso: true, dados: moeda });
  }

  async deletar(req, res) {
      const { id } = req.params;
      const existingMoeda = await this.service.findById(id);
      const deletado = await this.service.delete(id);
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Moeda removida" })
  
    
  }
}