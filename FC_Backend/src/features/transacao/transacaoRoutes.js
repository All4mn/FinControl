import { TransacaoController } from "./transacao.controller.js";
import { TransacaoRepository } from "./transacao.repository.js";
import { TransacaoService } from "./transacao.service.js";

const transacaoRepository = new TransacaoRepository();
const transacaoService = new TransacaoService(transacaoRepository);
const transacaoController = new TransacaoController(transacaoService);

export async function transacaoRoutes(app) {
  app.get("/", transacaoController.listar);
  app.put("/:id/archive", transacaoController.archive);
  app.get("/:id", transacaoController.buscarPorId);
  app.post("/", transacaoController.criar);
  app.put("/:id", transacaoController.atualizar);
  app.delete("/:id", transacaoController.deletar);
}
