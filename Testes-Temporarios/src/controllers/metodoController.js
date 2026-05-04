import MetodoModel from '../models/metodo.js';

const MetodoController = {
  async listar(req, res) {
    try {
      const metodos = await MetodoModel.findAll();
      return res.status(200).send({ sucesso: true, dados: metodos });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const metodo = await MetodoModel.findById(id);
      if (!metodo) return res.status(404).send({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).send({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async criar(req, res) {
    try {
      const novoMetodo = await MetodoModel.create(req.body);
      return res.status(201).send({ sucesso: true, dados: novoMetodo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const metodo = await MetodoModel.update(id, req.body);
      if (!metodo) return res.status(404).send({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).send({ sucesso: true, dados: metodo });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  },
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await MetodoModel.delete(id);
      if (!deletado) return res.status(404).send({ sucesso: false, mensagem: 'Método não encontrado' });
      return res.status(200).send({ sucesso: true, mensagem: 'Método removido' });
    } catch (err) {
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
    }
  }
};

export default MetodoController;