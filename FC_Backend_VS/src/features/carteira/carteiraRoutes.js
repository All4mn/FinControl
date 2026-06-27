import { CarteiraController } from "./carteira.controller.js";
import { CarteiraRepository } from "./carteira.repository.js";
import { CarteiraService } from "./carteira.service.js";

const carteiraRepository = new CarteiraRepository();
const carteiraService = new CarteiraService(carteiraRepository);
const carteiraController = new CarteiraController(carteiraService);

export async function carteiraRoutes(app) {
  app.get("/", carteiraController.listar);
  app.get("/usuario/:id_usuario", carteiraController.listarPorUsuario);
  app.get("/:id", carteiraController.buscarPorId);
  app.post("/", carteiraController.criar);
  app.put("/:id", carteiraController.atualizar);
  app.delete("/:id", carteiraController.deletar);
}
