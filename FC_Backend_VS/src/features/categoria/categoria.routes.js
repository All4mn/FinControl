import { CategoriaController } from "./categoria.controller.js";
import { CategoriaRepository } from "./categoria.repository.js";
import { CategoriaService } from "./categoria.service.js";

const categoriaRepository = new CategoriaRepository();
const categoriaService = new CategoriaService(categoriaRepository);
const categoriaController = new CategoriaController(categoriaService);

export async function categoriaRoutes(app) {
  app.get("/", categoriaController.listar);
  app.get("/:id", categoriaController.buscarPorId);
  app.post("/", categoriaController.criar);
  app.put("/:id", categoriaController.atualizar);
  app.delete("/:id", categoriaController.deletar);
}
