import { CarteiraController } from "./carteira.controller.js";
import { CarteiraRepository } from "./carteira.repository.js";
import { CarteiraService } from "./carteira.service.js";
import { requireAuth } from "../../middlewares/auth.js";

const carteiraRepository = new CarteiraRepository();
const carteiraService = new CarteiraService(carteiraRepository);
const carteiraController = new CarteiraController(carteiraService);

export async function carteiraRoutes(app) {
  app.get("/", { preHandler: [requireAuth] }, carteiraController.listar);
  app.get(
    "/usuario/:id_usuario",
    { preHandler: [requireAuth] },
    carteiraController.listarPorUsuario,
  );
  app.get("/:id", { preHandler: [requireAuth] }, carteiraController.buscarPorId);
  app.post("/", { preHandler: [requireAuth] }, carteiraController.criar);
  app.put("/:id", { preHandler: [requireAuth] }, carteiraController.atualizar);
  app.delete("/:id", { preHandler: [requireAuth] }, carteiraController.deletar);
}
