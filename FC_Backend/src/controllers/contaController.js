import ContaModel from '../models/conta.js';

const ContaController = {
  async listar(req, res) {
    try {
      const contas = await ContaModel.findAll();
      return res.status(200).send({ sucesso: true, dados: contas });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const conta = await ContaModel.findById(id);
      if (!conta) return res.status(404).send({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async criar(req, res) {
    try {
      const novaConta = await ContaModel.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaConta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const conta = await ContaModel.update(id, req.body);
      if (!conta) return res.status(404).send({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).send({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await ContaModel.delete(id);
      if (!deletado) return res.status(404).send({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).send({ sucesso: true, mensagem: 'Conta removida' });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  }
};

export default ContaController;