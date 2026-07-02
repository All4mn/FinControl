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
    this.desarquivar = this.desarquivar.bind(this)
  }

  async listar(req, res) {
    try {
      const contas = await this.service.findAll(req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, dados: contas });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const conta = await this.service.findById(id, req.usuario.id_usuario);
      if (!conta)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Conta não encontrada" });
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaConta = await this.service.create({
        id_usuario: req.usuario.id_usuario,
        id_moeda: req.body.id_moeda,
        nome_conta: req.body.nome_conta,
        saldo_conta: req.body.saldo_conta,
      });
      return res.status(201).send({ sucesso: true, dados: novaConta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome_conta } = req.body;
      const conta = await this.service.update(id, nome_conta, req.usuario.id_usuario);
      if (!conta)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Conta não encontrada" });
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async arquivar(req, res) {
    try {
      const { id } = req.params;
      const arquivado = await this.service.arquivar(id, req.usuario.id_usuario);
      if (!arquivado)
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Conta não encontrada" });
      return res.status(200).send({ sucesso: true, mensagem: "Conta arquivada" });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async desarquivar(req,res){
    try {
      const { id } = req.params;
      const desarquivado = await this.service.desarquivar(id, req.usuario.id_usuario);
      if(!desarquivado)
        return res
      .status(404)
      .send({sucesso: false, mensagem:"Conta nao encontrada"});
      return res.status(200).send({ sucesso: true, mensagem: "conta desarquivada" });
    } catch (error) {
      return res.status(500).send({ sucesso: false, mensagem: error.message });
    }
   

    
  }

  async search(req,res){
    try {
      const { id } = req.params
      if (Number(id) !== req.usuario.id_usuario) {
        return res.status(403).send({ sucesso: false, mensagem: "Acesso negado" });
      }
      const response = await this.service.search(id)
      return res.status(200).send({ sucesso: true, dados: response })
    } catch (error) {
      return res.status(500).send({ sucesso: false, mensagem: error.message });
    }
  }
}
