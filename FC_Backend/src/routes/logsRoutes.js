import logsController from "../controllers/logsController.js";

export async function logsRoutes(app) {
    app.get('/', logsController.listar);
}