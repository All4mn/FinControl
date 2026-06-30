import { CarteiraHasContaController } from "./carteiraHasConta.controller.js";
import { CarteiraHasContaRepository } from "./carteiraHasConta.repository.js";
import { CarteiraHasContaService } from "./carteiraHasConta.service.js";

const repository = new CarteiraHasContaRepository();
const service = new CarteiraHasContaService(repository);
const controller = new CarteiraHasContaController(service);

export async function CarteiraHasContaRoutes(app) {
  app.get("/", controller.listar);
  app.get("/:id", controller.buscarPorId);
  app.post("/", controller.criar);
  app.put("/:id", controller.atualizar);
  app.delete("/:id", controller.deletar);
}
