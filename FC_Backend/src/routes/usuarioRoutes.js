import UsuarioController from '../controllers/usuarioController.js';

export async function usuarioRoutes(app) {
    // Como definimos o prefixo '/usuarios' no app.js, a rota '/' equivale a '/usuarios'
    app.get('/', UsuarioController.listar);
    app.get('/:id', UsuarioController.buscarPorId);
    app.post('/', UsuarioController.criar);
    app.post('/login-google', UsuarioController.loginGoogle);
    app.put('/:id', UsuarioController.atualizar);
    app.delete('/:id', UsuarioController.deletar);
}