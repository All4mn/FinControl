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
    if (!contas || contas.length === 0) {
      throw new Error("Nenhuma conta encontrada", 404);
    }
    return res.status(200).send({ sucesso: true, dados: contas });
  }

  async buscarPorId(req, res) {
    const { id } = req.params;
    const conta = await this.service.findById(id);
    if (!conta) throw new Error("Conta não encontrada", 404);
    return res.status(200).send({ sucesso: true, dados: conta });
  }

  async criar(req, res) {

    const { id_usuario, id_moeda, nome_conta, saldo_conta } = req.body;
    console.log("id_usuario", id_usuario);
    console.log("id_moeda", id_moeda);
    console.log("nome_conta", nome_conta);
    console.log("saldo_conta", saldo_conta);
    if(!id_usuario || !id_moeda || !nome_conta || saldo_conta === undefined) {
      throw new Error("Todos os campos são obrigatórios: id_usuario, id_moeda, nome_conta, saldo_conta", 400);
    }
    const novaConta = await this.service.create({
        id_usuario,
        id_moeda,
        nome_conta,
        saldo_conta,
      });
      if(!novaConta) throw new Error("Erro ao criar conta", 500);
      return res.status(201).send({ sucesso: true, dados: novaConta });
  }

  async atualizar(req, res) {
      const { id } = req.params;
      const { nome_conta } = req.body;
      const conta = await this.service.update(
        id,
        nome_conta,
      );
      if (!conta) throw new Error("Conta não encontrada", 404);
      return res.status(200).send({ sucesso: true, dados: conta });
  }

  async arquivar(req, res) {
    const { id } = req.params;
    const arquivado = await this.service.arquivar(id);
    if (!arquivado) throw new Error("Conta não encontrada", 404);
    return res.status(200).send({ sucesso: true, mensagem: "Conta arquivada" });
  }

  async desarquivar(req, res) {
    const { id } = req.params;
    const desarquivado = await this.service.desarquivar(id);
    if (!desarquivado) throw new Error("Conta não encontrada", 404);
    return res
      .status(200)
      .send({ sucesso: true, mensagem: "conta desarquivada" });
  }

  async search(req, res) {
    try {
      const { id } = req.params;
      // if (Number(id) !== req.usuario.id_usuario) {
      //   return res.status(403).send({ sucesso: false, mensagem: "Acesso negado" });
      // }
      const response = await this.service.search(id);
      return res.status(200).send({ sucesso: true, dados: response });
    } catch (error) {
      return res.status(500).send({ sucesso: false, mensagem: error.message });
    }
  }
}
