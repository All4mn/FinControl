import { responderErro } from "../../Errors/responderErro.js";

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
    try {
      const contas = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: contas });
    } catch (err) {
      return responderErro(res, err, "Erro ao listar contas:", "Não foi possível carregar as contas.");
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const conta = await this.service.findById(id);
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return responderErro(res, err, "Erro ao buscar conta:", "Não foi possível buscar a conta.");
    }
  }

  async criar(req, res) {
    try {
      const { id_usuario, id_moeda, nome_conta, saldo_conta } = req.body;
      const novaConta = await this.service.create({
        id_usuario,
        id_moeda,
        nome_conta,
        saldo_conta,
      });
      return res.status(201).send({ sucesso: true, dados: novaConta });
    } catch (err) {
      return responderErro(res, err, "Erro ao criar conta:", "Não foi possível criar a conta.");
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome_conta } = req.body;
      const conta = await this.service.update(
        id,
        nome_conta,
      );
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return responderErro(res, err, "Erro ao atualizar conta:", "Não foi possível atualizar a conta.");
    }
  }

  async arquivar(req, res) {
    try {
      const { id } = req.params;
      await this.service.arquivar(id);
      return res.status(200).send({ sucesso: true, mensagem: "Conta arquivada" });
    } catch (err) {
      return responderErro(res, err, "Erro ao arquivar conta:", "Não foi possível arquivar a conta.");
    }
  }

  async desarquivar(req, res) {
    try {
      const { id } = req.params;
      await this.service.desarquivar(id);
      return res.status(200).send({ sucesso: true, mensagem: "Conta desarquivada" });
    } catch (err) {
      return responderErro(res, err, "Erro ao desarquivar conta:", "Não foi possível reativar a conta.");
    }
  }

  async search(req, res) {
    try {
      const { id } = req.params;
      const { apenas_ativas } = req.query || {};
      const response = await this.service.search(id, apenas_ativas === "true");
      return res.status(200).send({ sucesso: true, dados: response });
    } catch (err) {
      return responderErro(res, err, "Erro ao buscar contas do usuário:", "Não foi possível carregar as contas.");
    }
  }
}
