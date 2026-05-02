// =============================================================================
// controllers/categoriaController.js
// CRUD de categorias
// =============================================================================

const CategoriaModel = require('../models/categoriaModel');

const getUsuarioId = (req) => req.headers['x-usuario-id'] || 1;

const CategoriaController = {
  async listar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const categorias = await CategoriaModel.findAll(usuario_id);
      return res.status(200).json({ sucesso: true, dados: categorias });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const categoria = await CategoriaModel.findById(req.params.id);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const usuario_id = getUsuarioId(req);
      const { nome, tipo, cor, icone } = req.body;
      if (!nome || !tipo) return res.status(400).json({ sucesso: false, mensagem: 'Nome e tipo obrigatórios' });
      const categoria = await CategoriaModel.create({ usuario_id, nome, tipo, cor, icone });
      return res.status(201).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const categoria = await CategoriaModel.update(req.params.id, req.body);
      if (!categoria) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const deletado = await CategoriaModel.delete(req.params.id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).json({ sucesso: true, mensagem: 'Categoria removida' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = CategoriaController;
