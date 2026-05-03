// =============================================================================
// controllers/authController.js
// Lógica de autenticação: registro e login
// =============================================================================

const crypto = require('crypto');
const UsuarioModel = require('../models/usuarioModel');

/**
 * Gera hash SHA-256 simples da senha.
 * Em produção, use bcrypt: npm install bcrypt
 */
const hashSenha = (senha) =>
  crypto.createHash('sha256').update(senha).digest('hex');

const AuthController = {
  /**
   * POST /auth/registro
   * Cria um novo usuário no sistema.
   */
  async registro(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Nome, e-mail e senha são obrigatórios',
        });
      }

      // Verifica se e-mail já existe
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'E-mail já cadastrado',
        });
      }

      const senha_hash = hashSenha(senha);
      const novoUsuario = await UsuarioModel.create({ nome, email, senha_hash });

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Usuário criado com sucesso',
        dados: novoUsuario,
      });
    } catch (err) {
      console.error('Erro no registro:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
  },

  /**
   * POST /auth/login
   * Autentica o usuário e retorna token JWT simples.
   */
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'E-mail e senha são obrigatórios',
        });
      }

      const usuario = await UsuarioModel.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
      }

      const senhaCorreta = usuario.senha_hash === hashSenha(senha);
      if (!senhaCorreta) {
        return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
      }

      // Token simples (em produção, use jsonwebtoken)
      const token = Buffer.from(
        JSON.stringify({ id: usuario.id, email: usuario.email, exp: Date.now() + 86400000 })
      ).toString('base64');

      return res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
      });
    } catch (err) {
      console.error('Erro no login:', err.message);
      return res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
    }
  },

  /**
   * GET /auth/me
   * Retorna dados do usuário autenticado (stub - implementar middleware JWT).
   */
  async me(req, res) {
    return res.status(200).json({
      sucesso: true,
      mensagem: 'Endpoint /auth/me — implemente middleware JWT para autenticar',
    });
  },
};

module.exports = AuthController;
