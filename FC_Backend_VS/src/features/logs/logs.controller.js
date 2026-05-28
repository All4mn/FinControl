export class LogsController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para evitar perda de contexto nas rotas
    this.listar = this.listar.bind(this);
  }

  async listar(req, res) {
    try {
      const logs = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: logs });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
