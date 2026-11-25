import jwt from "jsonwebtoken";
import { isProduction, requireEnv } from "./env.js";

export const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 60 * 60 * 24;

const secret = () => requireEnv("JWT_SECRET");

export const createSessionToken = (id_usuario) =>
  jwt.sign({ id_usuario }, secret(), { expiresIn: "1d" });

export const verifySessionToken = (token) => jwt.verify(token, secret());

export const setAuthCookie = (reply, token) => {
  const producao = isProduction();
  reply.setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: producao,
    sameSite: producao ? "none" : "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
};

export const clearAuthCookie = (reply) =>
  reply.clearCookie(COOKIE_NAME, { path: "/" });
