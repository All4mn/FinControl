import { ContaController } from "./conta.controller.js";
import { ContaRepository } from "./conta.repository.js";
import { ContaService } from "./conta.service.js";

const contaRepository = new ContaRepository();
const contaService = new ContaService(contaRepository);
const contaController = new ContaController(contaService);

export async function contaRoutes(app) {
//   app.get('/search/:id', async (req,res)=>{
//   return contaController.search(req,res)
// })

  app.get('/search/:id', contaController.search);

// app.put("/arquivar/:id", async(req,res)=>{
//   return contaController.arquivar(req,res)
// });

  app.put("/arquivar/:id", contaController.arquivar)
// app.put('/desarquivar/:id', async (req,res)=>{
// return contaController.desarquivar(req,res)
// })
  app.put('/desarquivar/:id', contaController.desarquivar)
  app.get("/", contaController.listar);
  app.get("/:id", contaController.buscarPorId);
  app.post("/", contaController.criar);
  app.put("/:id", contaController.atualizar);
}
