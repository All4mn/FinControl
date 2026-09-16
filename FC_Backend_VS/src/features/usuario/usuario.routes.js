import { UsuarioController } from "./usuario.controller.js";
import { UsuarioRepository } from "./usuario.repository.js";
import { UsuarioService } from "./usuario.service.js";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);
const usuarioController = new UsuarioController(usuarioService);

export async function usuarioRoutes(app) {
  app.post("/login", usuarioController.login);
  app.post("/logout", usuarioController.logout);
  app.get("/me", usuarioController.me);
  app.get("/verificar-email", usuarioController.verificarEmail);
  app.get("/", usuarioController.listar);
  app.patch("/desativar/:id", usuarioController.desativar);
  app.get("/:id", usuarioController.buscarPorId);
  app.post("/", usuarioController.criar);
  app.post("/login-google", async (req, res) => {
    console.log("Recebendo requisição para login com Google");
    await usuarioController.loginGoogle(req, res);
  });
  app.put("/atualizar", usuarioController.atualizarPerfil);
  app.delete("/deletar-conta", usuarioController.deletarConta);
  app.put("/:id", usuarioController.atualizar);
  app.delete("/:id", usuarioController.deletar);
}
