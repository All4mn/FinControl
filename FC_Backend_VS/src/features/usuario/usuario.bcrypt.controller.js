import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import { requireEnv } from "../../config/env.js";
import {
  clearAuthCookie,
  COOKIE_NAME,
  createSessionToken,
  setAuthCookie,
  verifySessionToken,
} from "../../config/session.js";
import { ehHashBcrypt, normalizarEmail } from "./usuario.utils.js";

export class UsuarioBcryptController {
  constructor(service) {
    this.service = service;

    // Vincular o context 'this' para todos os métodos
    this.listar = this.listar.bind(this);
    this.login = this.login.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
    this.me = this.me.bind(this);
    this.logout = this.logout.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
    this.desativar = this.desativar.bind(this);
    this.verificarEmail = this.verificarEmail.bind(this);
    this.atualizarPerfil = this.atualizarPerfil.bind(this);
    this.deletarConta = this.deletarConta.bind(this);
  }

  async listar(req, res) {
    try {
      const usuarios = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: usuarios });
    } catch (err) {
      console.error("Erro ao listar usuários:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async login(req, res) {
    try {
      const email = normalizarEmail(req.body?.email_usuario);
      const senha =
        typeof req.body?.senha_usuario === "string"
          ? req.body.senha_usuario
          : "";

      if (!email || !senha) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
      }

      const usuario = await this.service.buscarPorEmailComSenha(email);
      if (!usuario) {
        return res.status(401).send({
          sucesso: false,
          mensagem:
            "Não foi possível realizar login. Verifique as credenciais; contas legadas não são mais aceitas.",
        });
      }

      if (!usuario.senha_usuario) {
        return res.status(401).send({
          sucesso: false,
          mensagem: "Esta conta usa login com Google. Use o botão do Google.",
        });
      }

      if (!ehHashBcrypt(usuario.senha_usuario)) {
        return res.status(401).send({
          sucesso: false,
          mensagem:
            "Conta legada: não é mais possível realizar login. Cadastre-se novamente ou use o Google.",
        });
      }

      if (usuario.id_status_usuario !== 1) {
        return res.status(401).send({
          sucesso: false,
          mensagem: "Usuário inativo. Não é possível realizar login.",
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_usuario);
      if (!senhaValida) {
        return res.status(401).send({
          sucesso: false,
          mensagem:
            "Não foi possível realizar login. Verifique as credenciais; contas legadas não são mais aceitas.",
        });
      }

      const token = createSessionToken(usuario.id_usuario);
      setAuthCookie(res, token);

      const { senha_usuario: _, ...usuarioSemSenha } = usuario;

      return res.status(200).send({ sucesso: true, dados: usuarioSemSenha });
    } catch (err) {
      console.error("Erro no login:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await this.service.findById(id);
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
  }

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

      const emailExistente = await this.service.buscarPorEmail(
        dados.email_usuario,
      );
      if (emailExistente) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email já cadastrado" });
      }

      // Hashear a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(dados.senha_usuario, salt);

      const novoUsuario = await this.service.create({
        nome_usuario: dados.nome_usuario,
        email_usuario: dados.email_usuario,
        senha_usuario: senhaHash,
        telefone_usuario: dados.telefone_usuario,
      });

      return res.status(201).send({ sucesso: true, dados: novoUsuario });
    } catch (err) {
      console.error("Erro ao criar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async loginGoogle(req, res) {
    try {
      const idToken = req.body?.idToken;
      if (typeof idToken !== "string" || !idToken) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "idToken é obrigatório" });
      }

      const clientId = requireEnv("GOOGLE_CLIENT_ID");
      let payload;
      try {
        const ticket = await new OAuth2Client(clientId).verifyIdToken({
          idToken,
          audience: clientId,
        });
        payload = ticket.getPayload();
      } catch (err) {
        console.warn("Token do Google rejeitado:", err.message);
        return res.status(401).send({
          sucesso: false,
          mensagem: "Token do Google inválido ou expirado.",
        });
      }

      if (!payload) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Token do Google inválido." });
      }

      const googleId = payload.sub;
      const email = normalizarEmail(payload.email);
      const nome = payload.name || payload.given_name || "Usuário Google";

      if (!googleId || !email) {
        return res.status(401).send({
          sucesso: false,
          mensagem: "Token do Google sem identificador ou e-mail.",
        });
      }

      let usuario = await this.service.findByGoogleId(googleId);
      if (!usuario) {
        const existente = await this.service.buscarPorEmail(email);
        if (existente) {
          await this.service.vincularGoogle(existente.id_usuario, googleId);
        } else {
          await this.service.createWithGoogle({
            google_id: googleId,
            nome_usuario: nome,
            email_usuario: email,
          });
        }
        usuario = await this.service.findByGoogleId(googleId);
      }

      if (!usuario) {
        return res.status(500).send({
          sucesso: false,
          mensagem: "Não foi possível vincular a conta do Google.",
        });
      }

      if (usuario.id_status_usuario !== 1) {
        return res.status(401).send({
          sucesso: false,
          mensagem: "Usuário inativo. Não é possível realizar login.",
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
  }

  async me(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      const payload = verifySessionToken(token);
      const usuario = await this.service.findById(payload.id_usuario);
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
  }

  async logout(req, res) {
    try {
      clearAuthCookie(res);
      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Logout realizado" });
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;

      // Se for fornecida nova senha, hashear antes de salvar
      if (dados.senha_usuario) {
        const salt = await bcrypt.genSalt(10);
        dados.senha_usuario = await bcrypt.hash(dados.senha_usuario, salt);
      }

      const usuario = await this.service.update(id, dados);
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
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      const deletado = await this.service.delete(id);
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
  }

  async desativar(req, res) {
    console.log(
      "Recebendo requisição para desativar usuário com ID:",
      req.params.id,
    );
    try {
      const { id } = req.params;
      const desativado = await this.service.desativar(id);
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
  }

  async verificarEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email é obrigatório" });
      }

      const usuarioExistente = await this.service.buscarPorEmail(email);
      return res
        .status(200)
        .send({ sucesso: true, existe: !!usuarioExistente });
    } catch (err) {
      console.error("Erro ao verificar email:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

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
      const usuarioAtual = await this.service.findById(payload.id_usuario);
      if (!usuarioAtual) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      // Verificar se o novo email já existe (se foi alterado)
      if (email_usuario && email_usuario !== usuarioAtual.email_usuario) {
        const emailExistente = await this.service.buscarPorEmail(email_usuario);
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
        senha_usuario: senha
          ? await bcrypt.hash(senha, await bcrypt.genSalt(10))
          : usuarioAtual.senha_usuario,
        telefone_usuario: usuarioAtual.telefone_usuario,
      };

      const usuarioAtualizado = await this.service.update(
        payload.id_usuario,
        dadosAtualizados,
      );
      return res.status(200).send({ sucesso: true, dados: usuarioAtualizado });
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async deletarConta(req, res) {
    try {
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      const payload = verifySessionToken(token);
      const deletado = await this.service.delete(payload.id_usuario);

      if (!deletado) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      clearAuthCookie(res);

      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Conta deletada com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar conta:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
