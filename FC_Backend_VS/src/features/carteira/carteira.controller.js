export class CarteiraController {
  constructor(service) {
    this.service = service;

    this.listar = this.listar.bind(this);
    this.listarPorUsuario = this.listarPorUsuario.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const carteiras = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: carteiras });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async listarPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const carteiras = await this.service.findByUsuario(id_usuario);
      return res.status(200).send({ sucesso: true, dados: carteiras });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const carteira = await this.service.findById(id);
      if (!carteira)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Carteira não encontrada" });
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaCarteira = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaCarteira });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const carteira = await this.service.update(id, req.body);
      if (!carteira)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Carteira não encontrada" });
      return res.status(200).send({ sucesso: true, dados: carteira });
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
          .send({ sucesso: false, mensagem: "Carteira não encontrada" });
      return res.status(200).send({ sucesso: true, mensagem: "Carteira removida" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
