export class CategoriaController {
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
      const categorias = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: categorias });
    } catch (err) {
      console.log("Erro ao listar categorias:", err);
      return res
        .status(500)
        .send({ sucesso: false, mensagem: "Erro interno", stack: err.stack });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await this.service.findById(id);
      if (!categoria)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Categoria não encontrada" });
      return res.status(200).send({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaCategoria = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaCategoria });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const categoria = await this.service.update(id, req.body);
      if (!categoria)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Categoria não encontrada" });
      return res.status(200).send({ sucesso: true, dados: categoria });
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
          .send({ sucesso: false, mensagem: "Categoria não encontrada" });
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Categoria removida" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
