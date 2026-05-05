import UsuarioModel from "../models/usuario.js";

const UsuarioController = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      return res.status(200).send({ sucesso: true, dados: usuarios });
    } catch (err) {
      console.error("Erro ao listar usuários:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.findById(id);
      if (!usuario) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }
      return res.status(200).send({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error("Erro ao buscar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async criar(req, res) {
    try {
      const dados = req.body;

      if (
        !dados.nome_usuario ||
        !dados.email_usuario ||
        !dados.senha_usuario ||
        !dados.telefone_usuario
      ) {
        return res
          .status(400)
          .send({
            sucesso: false,
            mensagem: "Todos os campos são obrigatórios",
          });
      }

      const emailExistente = await UsuarioModel.buscarPorEmail(
        dados.email_usuario,
      );
      if (emailExistente) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email já cadastrado" });
      }
      const novoUsuario = await UsuarioModel.create(dados);
      return res.status(201).send({ sucesso: true, dados: novoUsuario });
    } catch (err) {
      console.error("Erro ao criar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const usuario = await UsuarioModel.update(id, dados);
      if (!usuario) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }
      return res.status(200).send({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await UsuarioModel.delete(id);
      if (!deletado) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Usuário removido com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },
};

export default UsuarioController;
