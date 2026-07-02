import { ContaController } from "./conta.controller.js";
import { ContaRepository } from "./conta.repository.js";
import { ContaService } from "./conta.service.js";
import { requireAuth } from "../../middlewares/auth.js";

const contaRepository = new ContaRepository();
const contaService = new ContaService(contaRepository);
const contaController = new ContaController(contaService);

export async function contaRoutes(app) {
  app.get('/search/:id', { preHandler: [requireAuth] }, contaController.search);
  app.put('/arquivar/:id', { preHandler: [requireAuth] }, contaController.arquivar);
  app.put('/desarquivar/:id', { preHandler: [requireAuth] }, contaController.desarquivar);
  app.get("/", { preHandler: [requireAuth] }, contaController.listar);
  app.get("/:id", { preHandler: [requireAuth] }, contaController.buscarPorId);
  app.post("/", { preHandler: [requireAuth] }, contaController.criar);
  app.put("/:id", { preHandler: [requireAuth] }, contaController.atualizar);
}
