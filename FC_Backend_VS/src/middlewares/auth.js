import { COOKIE_NAME, verifySessionToken } from "../config/session.js";
import { AppError } from "../Errors/AppError.js";

export const requireAuth = async (req, reply) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    throw new AppError("Não autenticado", 401);
  }

  try {
    const payload = verifySessionToken(token);
    req.usuario = { id_usuario: payload.id_usuario };
  } catch (err) {
    throw new AppError("Sessão inválida", 401);
  }
};
