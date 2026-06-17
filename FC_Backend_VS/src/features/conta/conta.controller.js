export class ContaController {
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
      const contas = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: contas });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const conta = await this.service.findById(id);
      if (!conta)
        return res
          .status(404)
          .send({ sucesso: false, message: "Conta não encontrada" }); // Note: standardizing responses to use 'mensagem' or what's original. Let's keep original: 'mensagem'
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaConta = await this.service.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaConta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const conta = await this.service.update(id, req.body);
      if (!conta)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Conta não encontrada" });
      return res.status(200).send({ sucesso: true, dados: conta });
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
          .send({ sucesso: false, mensagem: "Conta não encontrada" });
      return res.status(200).send({ sucesso: true, mensagem: "Conta removida" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async search(req,res){
    const { id } = req.params
    console.log(id)
    const response = await this.service.search(id)
    return res.status(200).send({ sucesso: true, dados: response })
  }
}
