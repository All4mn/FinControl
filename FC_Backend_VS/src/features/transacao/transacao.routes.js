import { TransacaoController } from "./transacao.controller.js";
import { TransacaoRepository } from "./transacao.repository.js";
import { TransacaoService } from "./transacao.service.js";
import { requireAuth } from "../../middlewares/auth.js";

const transacaoRepository = new TransacaoRepository();
const transacaoService = new TransacaoService(transacaoRepository);
const transacaoController = new TransacaoController(transacaoService);

export async function transacaoRoutes(app) {
  app.get("/", { preHandler: [requireAuth] }, transacaoController.listar);
  app.get("/:id", { preHandler: [requireAuth] }, transacaoController.buscarPorId);
  app.post("/", { preHandler: [requireAuth] }, transacaoController.criar);
  app.put("/:id", { preHandler: [requireAuth] }, transacaoController.atualizar);
  app.delete("/:id", { preHandler: [requireAuth] }, transacaoController.deletar);
}
