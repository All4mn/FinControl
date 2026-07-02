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
  app.get(
    "/all",
    { preHandler: [requireAuth] },
    carteiraController.listarTodas,
  );
  app.get("/:id", { preHandler: [requireAuth] }, carteiraController.buscarPorId);
  app.put(
    "/admin/:id",
    { preHandler: [requireAuth] },
    carteiraController.atualizarAdmin,
  );
  // A criação e exclusão de carteira não são permitidas manualmente.
  // A carteira é criada automaticamente ao registrar o usuário.
  app.put("/:id", { preHandler: [requireAuth] }, carteiraController.atualizar);
}
