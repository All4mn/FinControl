// =============================================================================
// src/features/moeda/moedaRoutes.js
// Configuração das rotas de moeda
// =============================================================================

import { MoedaController } from "./moeda.controller.js";
import { MoedaRepository } from "./moeda.repository.js";
import { MoedaService } from "./moeda.service.js";

const moedaRepository = new MoedaRepository();
const moedaService = new MoedaService(moedaRepository);
const moedaController = new MoedaController(moedaService);

export async function moedaRoutes(app) {
  app.get("/", moedaController.listar);
  app.get("/:id", moedaController.buscarPorId);
  app.post("/", moedaController.criar);
  app.put("/:id", moedaController.atualizar);
  app.delete("/:id", moedaController.deletar);
}