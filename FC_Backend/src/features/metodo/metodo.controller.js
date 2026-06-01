export class MetodoController {
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
      const metodos = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: metodos });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const metodo = await this.service.findById(id);
      if (!metodo)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Método não encontrado" });
      return res.status(200).send({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novoMetodo = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novoMetodo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const metodo = await this.service.update(id, req.body);
      if (!metodo)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Método não encontrado" });
      return res.status(200).send({ sucesso: true, dados: metodo });
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
          .send({ sucesso: false, mensagem: "Método não encontrado" });
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Método removido" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
