import CategoriaController from '../controllers/categoriaController.js';

export async function categoriaRoutes(app) {
    app.get('/', CategoriaController.listar);
    app.get('/:id', CategoriaController.buscarPorId);
    app.post('/', CategoriaController.criar);
    app.put('/:id', CategoriaController.atualizar);
    app.delete('/:id', CategoriaController.deletar);
}