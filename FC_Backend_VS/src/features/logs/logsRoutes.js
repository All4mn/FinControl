import { LogsController } from "./logs.controller.js";
import { LogsRepository } from "./logs.repository.js";
import { LogsService } from "./logs.service.js";

const logsRepository = new LogsRepository();
const logsService = new LogsService(logsRepository);
const logsController = new LogsController(logsService);

export async function logsRoutes(app) {
  app.get("/", logsController.listar);
  app.get('/filter', async (req,res)=>{   
  return logsController.listarFiltrado(req,res)
  })
}
