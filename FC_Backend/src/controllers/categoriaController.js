import CategoriaModel from '../models/categoria.js';

const CategoriaController = {
  async listar(req, res) {
    try {
      const categorias = await CategoriaModel.findAll();
      return res.status(200).send({ sucesso: true, dados: categorias });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.findById(id);
      if (!categoria) return res.status(404).send({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).send({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async criar(req, res) {
    try {
      const novaCategoria = await CategoriaModel.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novaCategoria });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaModel.update(id, req.body);
      if (!categoria) return res.status(404).send({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).send({ sucesso: true, dados: categoria });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await CategoriaModel.delete(id);
      if (!deletado) return res.status(404).send({ sucesso: false, mensagem: 'Categoria não encontrada' });
      return res.status(200).send({ sucesso: true, mensagem: 'Categoria removida' });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  }
};

export default CategoriaController;