import ContaController from '../controllers/contaController.js';

export async function contaRoutes(app) {
    app.get('/', ContaController.listar);
    app.get('/:id', ContaController.buscarPorId);
    app.post('/', ContaController.criar);
    app.put('/:id', ContaController.atualizar);
    app.delete('/:id', ContaController.deletar);
}