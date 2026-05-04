import TransacaoController from '../controllers/transacaoController.js';

export async function transacaoRoutes(app) {
    app.get('/', TransacaoController.listar);
    app.get('/:id', TransacaoController.buscarPorId);
    app.post('/', TransacaoController.criar);
    app.put('/:id', TransacaoController.atualizar);
    app.delete('/:id', TransacaoController.deletar);
}