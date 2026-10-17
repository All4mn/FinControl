import { UsuarioBcryptController } from "./usuario.bcrypt.controller.js";
import { UsuarioRepository } from "./usuario.repository.js";
import { UsuarioService } from "./usuario.service.js";
import { requireAuth } from "../../middlewares/auth.js";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioBcryptController(usuarioService);

export async function usuarioRoutes(app) {
  app.post("/login", usuarioController.login);
  app.post("/", usuarioController.criar);
  app.post("/login-google", usuarioController.loginGoogle);
  app.get("/verificar-email", usuarioController.verificarEmail);
  app.post("/logout", usuarioController.logout);

  app.get("/me", { preHandler: [requireAuth] }, usuarioController.me);
  app.get("/", { preHandler: [requireAuth] }, usuarioController.listar);
  app.get("/:id", { preHandler: [requireAuth] }, usuarioController.buscarPorId);
  app.patch("/desativar/:id", { preHandler: [requireAuth] }, usuarioController.desativar);
  app.put("/atualizar", { preHandler: [requireAuth] }, usuarioController.atualizarPerfil);
  app.delete("/deletar-conta", { preHandler: [requireAuth] }, usuarioController.deletarConta);
  app.put("/:id", { preHandler: [requireAuth] }, usuarioController.atualizar);
  app.delete("/:id", { preHandler: [requireAuth] }, usuarioController.deletar);
}
