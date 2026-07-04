export class ContaController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para evitar perda de contexto nas rotas
    this.listar = this.listar.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.arquivar = this.arquivar.bind(this);
    this.search = this.search.bind(this);
    this.desarquivar = this.desarquivar.bind(this);
  }

  async listar(req, res) {
    const contas = await this.service.findAll();
    return res.status(200).send({ sucesso: true, dados: contas });
  }

  async buscarPorId(req, res) {
    const { id } = req.params;
    const conta = await this.service.findById(id);
    return res.status(200).send({ sucesso: true, dados: conta });
  }

  async criar(req, res) {
    const { id_usuario, id_moeda, nome_conta, saldo_conta } = req.body;
    const novaConta = await this.service.create({
        id_usuario,
        id_moeda,
        nome_conta,
        saldo_conta,
      });
      return res.status(201).send({ sucesso: true, dados: novaConta });
  }

  async atualizar(req, res) {
      const { id } = req.params;
      const { nome_conta } = req.body;
      const conta = await this.service.update(
        id,
        nome_conta,
      );
      return res.status(200).send({ sucesso: true, dados: conta });
  }

  async arquivar(req, res) {
    const { id } = req.params;
    const arquivado = await this.service.arquivar(id);
    return res.status(200).send({ sucesso: true, mensagem: "Conta arquivada" });
  }

  async desarquivar(req, res) {
    const { id } = req.params;
    const desarquivado = await this.service.desarquivar(id);
    return res
      .status(200)
      .send({ sucesso: true, mensagem: "conta desarquivada" });
  }

  async search(req, res) {
      const { id } = req.params;
      const response = await this.service.search(id);
      return res.status(200).send({ sucesso: true, dados: response });
    }
}
