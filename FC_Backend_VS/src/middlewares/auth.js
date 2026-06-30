import jwt from "jsonwebtoken";
import { AppError } from "../Errors/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-change-me";
const COOKIE_NAME = "session";

export const verifySessionToken = (token) => jwt.verify(token, JWT_SECRET);

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
