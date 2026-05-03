// =============================================================================
// middlewares/authMiddleware.js
// Middleware simples para autenticação por token JWT-like.
// =============================================================================

const decodeToken = (token) => {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (err) {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  // Fallback para desenvolvimento: aceitar header x-usuario-id
  if (!authorization && process.env.NODE_ENV !== 'production') {
    const usuarioId = req.headers['x-usuario-id'];
    if (usuarioId) {
      req.user = { id: Number(usuarioId) };
      return next();
    }
  }

  if (!authorization) {
    return res.status(401).json({ sucesso: false, mensagem: 'Cabeçalho Authorization ausente' });
  }

  const parts = authorization.split(' ');
  const [type, token] = parts;

  if (type?.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ sucesso: false, mensagem: 'Formato de token inválido' });
  }

  const payload = decodeToken(token);
  if (!payload || !payload.id) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou malformado' });
  }

  if (payload.exp && Date.now() > payload.exp) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token expirado' });
  }

  req.user = {
    id: payload.id,
    email: payload.email,
  };

  next();
};

module.exports = authMiddleware;
