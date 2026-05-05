// =============================================================================
// controllers/metodoController.js
// CRUD de métodos de pagamento
// =============================================================================

const MetodoModel = require('../models/metodoModel');

const MetodoController = {
  async listar(req, res) {
    try {
      const metodos = await MetodoModel.findAll();
      return res.status(200).json({ sucesso: true, dados: metodos });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const metodo = await MetodoModel.findById(req.params.id);
      if (!metodo) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, descricao } = req.body;
      if (!nome) return res.status(400).json({ sucesso: false, mensagem: 'Nome é obrigatório' });
      const metodo = await MetodoModel.create({ nome, descricao });
      return res.status(201).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async atualizar(req, res) {
    try {
      const metodo = await MetodoModel.update(req.params.id, req.body);
      if (!metodo) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },

  async deletar(req, res) {
    try {
      const deletado = await MetodoModel.delete(req.params.id);
      if (!deletado) return res.status(404).json({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).json({ sucesso: true, mensagem: 'Método removido' });
    } catch (err) {
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
};

module.exports = MetodoController;
