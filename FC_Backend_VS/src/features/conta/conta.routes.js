import { ContaController } from "./conta.controller.js";
import { ContaRepository } from "./conta.repository.js";
import { ContaService } from "./conta.service.js";

const contaRepository = new ContaRepository();
const contaService = new ContaService(contaRepository);
const contaController = new ContaController(contaService);

export async function contaRoutes(app) {
  // app.get('/search/:id', { preHandler: [requireAuth] }, contaController.search);
  app.get('/search/:id',  contaController.search);
  app.put('/arquivar/:id', contaController.arquivar);
  app.put('/desarquivar/:id', contaController.desarquivar);
  app.get("/", contaController.listar);
  app.get("/:id", contaController.buscarPorId);
  app.post("/", contaController.criar);
  app.put("/:id", contaController.atualizar);
}
