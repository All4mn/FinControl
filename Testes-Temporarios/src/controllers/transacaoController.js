import TransacaoModel from '../models/transacao.js';

const TransacaoController = {
  async listar(req, res) {
    try {
      const transacoes = await TransacaoModel.findAll();
      return res.status(200).send({ sucesso: true, dados: transacoes });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const transacao = await TransacaoModel.findById(id);
      if (!transacao) return res.status(404).send({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async criar(req, res) {
    try {
      const novaTransacao = await TransacaoModel.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaTransacao });
    } catch (err) {
      console.error("ERRO AO CRIAR TRANSAÇÃO:", err.message); // <-- Adicione esta linha
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const transacao = await TransacaoModel.update(id, req.body);
      if (!transacao) return res.status(404).send({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).send({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await TransacaoModel.delete(id);
      if (!deletado) return res.status(404).send({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).send({ sucesso: true, mensagem: 'Transação removida' });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  }
};

export default TransacaoController;