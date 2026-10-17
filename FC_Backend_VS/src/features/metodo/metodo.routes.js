import { MetodoController } from "./metodo.controller.js";
import { MetodoRepository } from "./metodo.repository.js";
import { MetodoService } from "./metodo.service.js";

const metodoRepository = new MetodoRepository();
const metodoService = new MetodoService(metodoRepository);
const metodoController = new MetodoController(metodoService);

export async function metodoRoutes(app) {
  app.get("/", metodoController.listar);
  app.get("/:id", metodoController.buscarPorId);
  app.post("/", metodoController.criar);
  app.put("/:id", metodoController.atualizar);
  app.delete("/:id", metodoController.deletar);
}
