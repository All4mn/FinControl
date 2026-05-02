// =============================================================================
// controllers/contaController.js
// CRUD de contas bancárias/carteiras
// =============================================================================

const ContaModel = require('../models/contaModel');

// Stub de usuario_id — em produção, virá do middleware JWT (req.usuario.id)
const getUsuarioId = (req) => req.headers['x-usuario-id'] || 1;

const ContaController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const contas = await ContaModel.findAll(usuario_id);
      return res.status(200).json({ sucesso: true, dados: contas });
    } catch (err) {
      console.error('Erro ao listar contas:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const conta = await ContaModel.findById(id, usuario_id);
      if (!conta) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { nome, tipo, saldo_inicial } = req.body;
      if (!nome || !tipo) {
        return res.status(400).json({ sucesso: false, mensagem: 'Nome e tipo são obrigatórios' });
      }
      const conta = await ContaModel.create({ usuario_id, nome, tipo, saldo_inicial });
      return res.status(201).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const conta = await ContaModel.update(id, usuario_id, req.body);
      if (!conta) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, dados: conta });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = getUsuarioId(req);
      const deletado = await ContaModel.delete(id, usuario_id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Conta não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Conta removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = ContaController;
