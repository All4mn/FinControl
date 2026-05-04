import MetodoController from '../controllers/metodoController.js';

export async function metodoRoutes(app) {
    app.get('/', MetodoController.listar);
    app.get('/:id', MetodoController.buscarPorId);
    app.post('/', MetodoController.criar);
    app.put('/:id', MetodoController.atualizar);
    app.delete('/:id', MetodoController.deletar);
}