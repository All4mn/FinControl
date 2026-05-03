// =============================================================================
// controllers/transacaoController.js
// CRUD de transações financeiras
// =============================================================================

const TransacaoModel = require('../models/transacaoModel');

const getUsuarioId = (req) => req.user?.id || Number(req.headers['x-usuario-id']) || 1;

const TransacaoController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { tipo, conta_id, data_inicio, data_fim } = req.query;
      const transacoes = await TransacaoModel.findAll(usuario_id, { tipo, conta_id, data_inicio, data_fim });
      return res.status(200).json({ sucesso: true, dados: transacoes });
    } catch (err) {
      console.error('Erro ao listar transações:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const transacao = await TransacaoModel.findById(id, usuario_id);
      if (!transacao) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { conta_id, categoria_id, metodo_id, tipo, descricao, valor, data } = req.body;

      if (!tipo || !valor || !data) {
        return res.status(400).json({ sucesso: false, mensagem: 'tipo, valor e data são obrigatórios' });
      }
      if (!['receita', 'despesa'].includes(tipo)) {
        return res.status(400).json({ sucesso: false, mensagem: 'tipo deve ser "receita" ou "despesa"' });
      }

      const transacao = await TransacaoModel.create({
        usuario_id, conta_id, categoria_id, metodo_id, tipo, descricao, valor, data,
      });
      return res.status(201).json({ sucesso: true, dados: transacao });
    } catch (err) {
      console.error('Erro ao criar transação:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const transacao = await TransacaoModel.update(id, usuario_id, req.body);
      if (!transacao) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, dados: transacao });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const deletado = await TransacaoModel.delete(id, usuario_id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Transação não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Transação removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async resumo(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const dados = await TransacaoModel.resumo(usuario_id);
      return res.status(200).json({ sucesso: true, dados });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = TransacaoController;
