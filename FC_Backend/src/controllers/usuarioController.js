import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UsuarioModel from "../models/usuario.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-change-me";
const COOKIE_NAME = "session";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createSessionToken = (id_usuario) =>
  jwt.sign({ id_usuario }, JWT_SECRET, { expiresIn: "1d" });

const setAuthCookie = (reply, token) => {
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
};

const verifySessionToken = (token) => jwt.verify(token, JWT_SECRET);

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
      const usuario = await UsuarioModel.findByLogin({
        email_usuario,
        senha_usuario,
      });
      // console.log("Usuário encontrado para login:", usuario);
      if (!usuario) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Email ou senha incorretos" });
      }

      const token = createSessionToken(usuario.id_usuario);
      setAuthCookie(res, token);

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
        return res.status(400).send({
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
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "idToken é obrigatório" });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "idToken inválido" });
      }

      const googleId = payload.sub;
      const email = payload.email;
      const nome = payload.name || payload.given_name || "Usuário Google";

      let usuario = await UsuarioModel.findByGoogleId(googleId);
      if (!usuario) {
        usuario = await UsuarioModel.createWithGoogle({
          google_id: googleId,
          nome_usuario: nome,
          email_usuario: email,
        });
      }

      const token = createSessionToken(usuario.id_usuario);
      setAuthCookie(res, token);

      const cadastroIncompleto = !usuario.telefone_usuario;
      return res
        .status(200)
        .send({ sucesso: true, dados: usuario, cadastroIncompleto });
    } catch (err) {
      console.error("Erro ao fazer login com Google:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async me(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      const payload = verifySessionToken(token);
      const usuario = await UsuarioModel.findById(payload.id_usuario);
      if (!usuario) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      return res.status(200).send({ sucesso: true, dados: usuario });
    } catch (err) {
      console.error("Erro ao buscar usuário autenticado:", err.message);
      return res
        .status(401)
        .send({ sucesso: false, mensagem: "Sessão inválida" });
    }
  },

  async logout(req, res) {
    try {
      return res
        .clearCookie(COOKIE_NAME, { path: "/" })
        .status(200)
        .send({ sucesso: true, mensagem: "Logout realizado" });
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
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

  async desativar(req, res) {
    console.log(
      "Recebendo requisição para desativar usuário com ID:",
      req.params.id,
    );
    try {
      const { id } = req.params;
      const desativado = await UsuarioModel.desativar(id);
      if (!desativado) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "usuario nao encontrado" });
      }
      res.send({ sucesso: true, mensagem: "usuario desativado com sucesso" });
    } catch (err) {
      console.error("Erro ao desativar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async verificarEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email é obrigatório" });
      }

      const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
      return res
        .status(200)
        .send({ sucesso: true, existe: !!usuarioExistente });
    } catch (err) {
      console.error("Erro ao verificar email:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async atualizarPerfil(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      const payload = verifySessionToken(token);
      const { nome_usuario, email_usuario, senha } = req.body;

      // Buscar usuário atual
      const usuarioAtual = await UsuarioModel.findById(payload.id_usuario);
      if (!usuarioAtual) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      // Verificar se o novo email já existe (se foi alterado)
      if (email_usuario && email_usuario !== usuarioAtual.email_usuario) {
        const emailExistente = await UsuarioModel.buscarPorEmail(email_usuario);
        if (emailExistente) {
          return res
            .status(400)
            .send({ sucesso: false, mensagem: "Email já está em uso" });
        }
      }

      // Preparar dados para atualização
      const dadosAtualizados = {
        nome_usuario: nome_usuario || usuarioAtual.nome_usuario,
        email_usuario: email_usuario || usuarioAtual.email_usuario,
        senha_usuario: senha || usuarioAtual.senha_usuario,
        telefone_usuario: usuarioAtual.telefone_usuario,
      };

      const usuarioAtualizado = await UsuarioModel.update(
        payload.id_usuario,
        dadosAtualizados,
      );
      return res.status(200).send({ sucesso: true, dados: usuarioAtualizado });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },

  async deletarConta(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      const payload = verifySessionToken(token);
      const deletado = await UsuarioModel.delete(payload.id_usuario);

      if (!deletado) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      // Limpar cookie de sessão
      res.clearCookie(COOKIE_NAME, { path: "/" });

      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Conta deletada com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar conta:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  },
};

export default UsuarioController;
