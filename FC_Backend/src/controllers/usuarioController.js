import { OAuth2Client } from 'google-auth-library';
import UsuarioModel from '../models/usuario.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

  async login(req, res) {
    try {
      const { email_usuario, senha_usuario } = req.body;
      if (!email_usuario || !senha_usuario) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
      }
      const usuario = await UsuarioModel.findByLogin({ email_usuario, senha_usuario });
      if (!usuario) {
        return res.status(401)
          .send({ sucesso: false, mensagem: "Email ou senha incorretos" });
      }
      return res.status(200).send({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error("Erro no login:", err.message);
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

  async loginGoogle(req, res) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).send({ sucesso: false, mensagem: 'idToken é obrigatório' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).send({ sucesso: false, mensagem: 'idToken inválido' });
      }

      const googleId = payload.sub;
      const email = payload.email;
      const nome = payload.name || payload.given_name || 'Usuário Google';

      let usuario = await UsuarioModel.findByGoogleId(googleId);
      if (!usuario) {
        usuario = await UsuarioModel.createWithGoogle({
          google_id: googleId,
          nome_usuario: nome,
          email_usuario: email,
        });
      }

      const cadastroIncompleto = !usuario.telefone_usuario;
      return res.status(200).send({ sucesso: true, dados: usuario, cadastroIncompleto });
    } catch (err) {
      console.error('Erro ao fazer login com Google:', err.message);
      return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
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
