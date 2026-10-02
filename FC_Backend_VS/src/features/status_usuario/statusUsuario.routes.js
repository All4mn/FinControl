import { StatusUsuarioController } from "./statusUsuario.controller.js";
import { StatusUsuarioRepository } from "./statusUsuario.repository.js";
import { StatusUsuarioService } from "./statusUsuario.service.js";

const repository = new StatusUsuarioRepository();
const service = new StatusUsuarioService(repository);
const controller = new StatusUsuarioController(service);

export async function statusUsuarioRoutes(app) {
  app.get("/", controller.listar);
  app.get("/:id", controller.buscarPorId);
  app.post("/", controller.criar);
  app.put("/:id", controller.atualizar);
  app.delete("/:id", controller.deletar);
}