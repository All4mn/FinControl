import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

// Configurações de autenticação e cookies
const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-change-me";
const COOKIE_NAME = "session";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Cria um token JWT para autenticação de sessão
 * @param {number} id_usuario - ID do usuário
 * @returns {string} Token JWT com expiração de 1 dia
 */
const createSessionToken = (id_usuario) =>
  jwt.sign({ id_usuario }, JWT_SECRET, { expiresIn: "1d" });

/**
 * Define um cookie de autenticação no navegador do cliente
 * Configurações de segurança:
 * - httpOnly: true - Evita acesso via JavaScript, protegendo contra XSS
 * - sameSite: "lax" - Proteção contra CSRF, permitindo requisições internas
 * - secure: true (produção) - Garante transmissão apenas via HTTPS em produção
 * - path: "/" - Cookie disponível em toda a aplicação
 * - maxAge: 86400 (24h) - Tempo de expiração do cookie em segundos
 * @param {Object} reply - Objeto de resposta do Fastify
 * @param {string} token - Token JWT a ser armazenado no cookie
 */
const setAuthCookie = (reply, token) => {
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true, // Inacessível via JavaScript
    sameSite: "lax", // Proteção CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS apenas em produção
    path: "/", // Disponível em toda a aplicação
    maxAge: 60 * 60 * 24, // 24 horas em segundos
  });
};

/**
 * Verifica e decodifica um token JWT de sessão
 * @param {string} token - Token JWT a ser verificado
 * @returns {Object} Payload do token contendo id_usuario
 * @throws {Error} Se o token for inválido ou expirado
 */
const verifySessionToken = (token) => jwt.verify(token, JWT_SECRET);

/**
 * Controlador de Usuários
 * Gerencia operações de autenticação, autorização e manipulação de usuários
 */
export class UsuarioController {
  /**
   * Inicializa o controlador vinculando o contexto de todos os métodos
   * Isso garante que 'this' refira-se sempre à instância da classe
   * @param {UsuarioService} service - Serviço de usuário para operações de negócio
   */
  constructor(service) {
    this.service = service;

    // Vincular o contexto 'this' para todos os métodos (evita problemas com escopo)
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

  /**
   * Lista todos os usuários cadastrados
   * @param {Object} req - Requisição HTTP
   * @param {Object} res - Resposta HTTP
   */
  async listar(req, res) {
    try {
      const usuarios = await this.service.findAll();
      return res.status(200).send({ sucesso: true, dados: usuarios });
    } catch (err) {
      console.error("Erro ao listar usuários:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  /**
   * Autentica um usuário com email e senha
   * Processo:
   * 1. Valida email e senha obrigatórios
   * 2. Busca usuário com credenciais corretas
   * 3. Gera um token JWT
   * 4. Armazena o token em um cookie httpOnly seguro
   * 5. Retorna os dados do usuário autenticado
   *
   * Segurança do Cookie:
   * - Armazenado no lado do servidor para autenticação futura
   * - Protegido contra XSS (httpOnly)
   * - Protegido contra CSRF (sameSite: lax)
   * - Apenas HTTPS em produção (secure)
   * - Expira em 24 horas
   *
   * @param {Object} req - Requisição HTTP com body { email_usuario, senha_usuario }
   * @param {Object} res - Resposta HTTP com cookie definido
   * @returns {Object} { sucesso: boolean, dados: usuario ou mensagem de erro }
   */
  async login(req, res) {
    try {
      const { email_usuario, senha_usuario } = req.body;

      // Valida campos obrigatórios
      if (!email_usuario || !senha_usuario) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email e senha são obrigatórios" });
      }

      // Busca usuário com credenciais correspondentes
      const usuario = await this.service.findByLogin({
        email_usuario,
        senha_usuario,
      });
      if (!usuario) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Email ou senha incorretos" });
      }

      // Gera token JWT e o armazena em um cookie seguro
      const token = createSessionToken(usuario.id_usuario);
      console.log(token)
      setAuthCookie(res, token);

      return res.status(200).send({ sucesso: true, dados: usuario, token: token });
    } catch (err) {
      console.error("Erro no login:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  /**
   * Busca um usuário específico pelo ID
   * @param {Object} req - Requisição com ID do usuário em params
   * @param {Object} res - Resposta HTTP
   */
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

  /**
   * Cria um novo usuário com validação de campos obrigatórios
   * Verifica duplicação de email antes de criar
   * @param {Object} req - Requisição com dados do usuário em body
   * @param {Object} res - Resposta HTTP
   */
  async criar(req, res) {
    try {
      const dados = req.body;

      // Valida campos obrigatórios
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

      // Verifica se email já está cadastrado
      const emailExistente = await this.service.buscarPorEmail(
        dados.email_usuario,
      );
      if (emailExistente) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "Email já cadastrado" });
      }

      const novoUsuario = await this.service.create(dados);
      return res.status(201).send({ sucesso: true, dados: novoUsuario });
    } catch (err) {
      console.error("Erro ao criar usuário:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  /**
   * Autentica um usuário via Google OAuth
   * Processo:
   * 1. Verifica e decodifica o idToken do Google
   * 2. Extrai informações do payload (googleId, email, nome)
   * 3. Busca ou cria usuário associado ao Google ID
   * 4. Gera um token JWT
   * 5. Armazena o token em um cookie httpOnly seguro
   * 6. Retorna flag indicando se cadastro está incompleto
   *
   * Fluxo de Cookies:
   * - idToken do Google é validado contra a audiência configurada
   * - Um novo JWT é gerado e armazenado em cookie seguro
   * - O cookie permite autenticação em requisições subsequentes
   * - Se telefone não existe, flag 'cadastroIncompleto' avisa ao frontend
   *
   * @param {Object} req - Requisição com { idToken } no body
   * @param {Object} res - Resposta HTTP com cookie de sessão definido
   * @returns {Object} { sucesso, dados: usuario, cadastroIncompleto }
   */
  async loginGoogle(req, res) {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res
          .status(400)
          .send({ sucesso: false, mensagem: "idToken é obrigatório" });
      }

      // Verifica e decodifica o idToken do Google
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

      // Extrai informações do usuário do payload do Google
      const googleId = payload.sub;
      const email = payload.email;
      const nome = payload.name || payload.given_name || "Usuário Google";

      // Busca usuário existente ou cria novo
      let usuario = await this.service.findByGoogleId(googleId);
      if (!usuario) {
        usuario = await this.service.createWithGoogle({
          google_id: googleId,
          nome_usuario: nome,
          email_usuario: email,
        });
      }

      // Gera token JWT e o armazena em cookie seguro
      const token = createSessionToken(usuario.id_usuario);
      setAuthCookie(res, token);

      // Verifica se cadastro está incompleto (falta telefone)
      const cadastroIncompleto = !usuario.telefone_usuario;
      return res
        .status(200)
        .send({ sucesso: true, dados: usuario, cadastroIncompleto });
    } catch (err) {
      console.error("Erro ao fazer login com Google:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  /**
   * Obtém os dados do usuário autenticado a partir da sessão
   * Processo:
   * 1. Recupera o cookie de sessão do header "Cookie"
   * 2. Verifica e decodifica o token JWT armazenado no cookie
   * 3. Extrai o id_usuario do payload do token
   * 4. Busca os dados completos do usuário no banco
   * 5. Retorna dados do usuário autenticado
   *
   * Fluxo de Cookies:
   * - Cookie é lido automaticamente pelo Fastify em req.cookies
   * - Token é verificado contra a chave secreta JWT_SECRET
   * - Se token expirado ou inválido, erro 401 é retornado
   * - Seguro contra manipulação de token (HMAC verificado)
   *
   * @param {Object} req - Requisição com cookie de sessão
   * @param {Object} res - Resposta HTTP
   * @returns {Object} { sucesso, dados: usuario ou mensagem de erro }
   */
  async me(req, res) {
    try {
      // Tenta recuperar o cookie de sessão
      const token = req.cookies?.[COOKIE_NAME];
      console.log(token)
      if (!token) {
        return res

          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticadooooooooo" });
      }

      // Verifica e decodifica o token JWT do cookie
      const payload = verifySessionToken(token);

      // Busca dados completos do usuário usando ID extraído do token
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
        .send({ sucesso: false, mensagem: "Sessão inválidaaaaaaaaaaaaaaaaa" });
    }
  }

  /**
   * Realiza o logout do usuário removendo o cookie de sessão
   * Processo:
   * 1. Remove o cookie de sessão do cliente via clearCookie
   * 2. Define o caminho do cookie como "/" (mesma configuração da criação)
   * 3. Retorna sucesso ao cliente
   *
   * Fluxo de Cookies:
   * - clearCookie envia um Set-Cookie com MaxAge=0
   * - Isso invalida o cookie no navegador do cliente
   * - O token JWT não pode mais ser usado para autenticação
   * - Requisições subsequentes não terão cookie válido
   *
   * @param {Object} req - Requisição HTTP
   * @param {Object} res - Resposta HTTP com cookie removido
   * @returns {Object} { sucesso: true, mensagem: "Logout realizado" }
   */
  async logout(req, res) {
    try {
      // Remove o cookie de sessão do cliente
      return res
        .clearCookie(COOKIE_NAME, { path: "/" })
        .status(200)
        .send({ sucesso: true, mensagem: "Logout realizado" });
    } catch (err) {
      console.error("Erro ao fazer logout:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  /**
   * Atualiza dados de um usuário específico
   * @param {Object} req - Requisição com ID em params e dados em body
   * @param {Object} res - Resposta HTTP
   */
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
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

  /**
   * Deleta um usuário específico pelo ID
   * @param {Object} req - Requisição com ID do usuário em params
   * @param {Object} res - Resposta HTTP
   */
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

  /**
   * Desativa um usuário sem deletar seus dados
   * @param {Object} req - Requisição com ID do usuário em params
   * @param {Object} res - Resposta HTTP
   */
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

  /**
   * Verifica se um email já existe no banco de dados
   * @param {Object} req - Requisição com email em query string
   * @param {Object} res - Resposta HTTP
   */
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

  /**
   * Atualiza o perfil do usuário autenticado
   * Processo:
   * 1. Recupera o cookie de sessão do cliente
   * 2. Verifica e decodifica o token JWT
   * 3. Valida os novos dados (nome, email, senha)
   * 4. Se email foi alterado, verifica duplicação
   * 5. Atualiza os dados no banco preservando outros campos
   * 6. Retorna dados atualizados
   *
   * Fluxo de Cookies:
   * - Cookie é usado para identificar o usuário autenticado
   * - Apenas o próprio usuário pode atualizar seu perfil
   * - Token continua válido após atualização
   * - Próximas requisições usam o mesmo cookie/token
   *
   * @param {Object} req - Requisição com cookie e body { nome_usuario, email_usuario, senha }
   * @param {Object} res - Resposta HTTP
   * @returns {Object} { sucesso, dados: usuarioAtualizado ou mensagem de erro }
   */
  async atualizarPerfil(req, res) {
    try {
      // Recupera o token do cookie
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      // Verifica e decodifica o token JWT
      const payload = verifySessionToken(token);
      const { nome_usuario, email_usuario, senha } = req.body;

      // Busca dados atuais do usuário
      const usuarioAtual = await this.service.findById(payload.id_usuario);
      if (!usuarioAtual) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      // Verifica se o novo email já existe (apenas se foi alterado)
      if (email_usuario && email_usuario !== usuarioAtual.email_usuario) {
        const emailExistente = await this.service.buscarPorEmail(email_usuario);
        if (emailExistente) {
          return res
            .status(400)
            .send({ sucesso: false, mensagem: "Email já está em uso" });
        }
      }

      // Prepara dados para atualização, mantendo valores atuais se não informados
      const dadosAtualizados = {
        nome_usuario: nome_usuario || usuarioAtual.nome_usuario,
        email_usuario: email_usuario || usuarioAtual.email_usuario,
        senha_usuario: senha || usuarioAtual.senha_usuario,
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

  /**
   * Deleta a conta do usuário autenticado
   * Processo:
   * 1. Recupera o cookie de sessão do cliente
   * 2. Verifica e decodifica o token JWT
   * 3. Extrai o id_usuario do payload
   * 4. Deleta o usuário do banco de dados
   * 5. Remove o cookie de sessão do cliente
   * 6. Retorna mensagem de sucesso
   *
   * Fluxo de Cookies:
   * - Cookie é usado para identificar o usuário autenticado
   * - Após deletar conta, o cookie é removido (clearCookie)
   * - Cliente recebe Set-Cookie com MaxAge=0 para invalidar cookie
   * - Requisições subsequentes não terão autenticação
   * - Garante logout automático após exclusão
   *
   * @param {Object} req - Requisição com cookie de sessão
   * @param {Object} res - Resposta HTTP com cookie removido
   * @returns {Object} { sucesso: true, mensagem: "Conta deletada com sucesso" }
   */
  async deletarConta(req, res) {
    try {
      // Recupera o token do cookie para identificar o usuário
      const token = req.cookies?.[COOKIE_NAME];
      if (!token) {
        return res
          .status(401)
          .send({ sucesso: false, mensagem: "Não autenticado" });
      }

      // Verifica e decodifica o token JWT
      const payload = verifySessionToken(token);

      // Deleta a conta do usuário
      const deletado = await this.service.delete(payload.id_usuario);

      if (!deletado) {
        return res
          .status(404)
          .send({ sucesso: false, mensagem: "Usuário não encontrado" });
      }

      // Remove o cookie de sessão do cliente (logout automático)
      res.clearCookie(COOKIE_NAME, { path: "/" });

      return res
        .status(200)
        .send({ sucesso: true, mensagem: "Conta deletada com sucesso" });
    } catch (err) {
      console.error("Erro ao deletar conta:", err.message);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
