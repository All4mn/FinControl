import { Icone_categoriaController } from "./Icone_categoria.controller.js";
import { Icone_categoriaRepository } from "./Icone_categoria.repository.js";
import { Icone_categoriaService } from "./Icone_categoria.service.js";

const repository = new Icone_categoriaRepository();
const service = new Icone_categoriaService(repository);
const controller = new Icone_categoriaController(service);

export async function Icone_categoriaRoutes(app) {
  app.get("/", controller.listar);
  app.get("/:id", controller.buscarPorId);
  app.post("/", controller.criar);
  app.put("/:id", controller.atualizar);
  app.delete("/:id", controller.deletar);
}
