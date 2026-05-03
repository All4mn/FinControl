// =============================================================================
// controllers/usuarioController.js
// CRUD de usuários
// =============================================================================

const UsuarioModel = require('../models/usuarioModel');

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      return res.status(200).json({ sucesso: true, dados: usuarios });
    } catch (err) {
      console.error('Erro ao listar usuários:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const usuarioLogadoId = req.user?.id;
      const { id } = req.params;
      if (Number(id) !== usuarioLogadoId) {
        return res.status(403).json({ sucesso: false, mensagem: 'Acesso negado' });
      }

      const usuario = await UsuarioModel.findById(id);
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error('Erro ao buscar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const usuarioLogadoId = req.user?.id;
      const { id } = req.params;
      if (Number(id) !== usuarioLogadoId) {
        return res.status(403).json({ sucesso: false, mensagem: 'Acesso negado' });
      }

      const { nome, email } = req.body;
      const usuario = await UsuarioModel.update(id, { nome, email });
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const usuarioLogadoId = req.user?.id;
      const { id } = req.params;
      if (Number(id) !== usuarioLogadoId) {
        return res.status(403).json({ sucesso: false, mensagem: 'Acesso negado' });
      }

      const deletado = await UsuarioModel.delete(id);
      if (!deletado) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
      }
      return res.status(200).json({ sucesso: true, mensagem: 'Usuário removido com sucesso' });
    } catch (err) {
      console.error('Erro ao deletar usuário:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = UsuarioController;
