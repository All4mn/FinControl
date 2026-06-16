export class StatusUsuarioController {
  constructor(service) {
    this.service = service;

    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const dados = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const dado = await this.service.findById(id);
      if (!dado)
        return res.status(404).send({ sucesso: false, mensagem: "Status não encontrado" });
      return res.status(200).send({ sucesso: true, dados: dado });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novo = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const atualizado = await this.service.update(id, req.body);
      if (!atualizado)
        return res.status(404).send({ sucesso: false, mensagem: "Status não encontrado" });
      return res.status(200).send({ sucesso: true, dados: atualizado });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.service.delete(id);
      if (!deletado)
        return res.status(404).send({ sucesso: false, mensagem: "Status não encontrado" });
      return res.status(200).send({ sucesso: true, mensagem: "Status removido" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}