import UsuarioController from '../controllers/usuarioController.js';

export async function usuarioRoutes(app) {
    // Como definimos o prefixo '/usuarios' no app.js, a rota '/' equivale a '/usuarios'
    app.post('/login', UsuarioController.login);
    app.post('/logout', UsuarioController.logout);
    app.get('/me', UsuarioController.me);
    app.get('/', UsuarioController.listar);
    app.patch('/desativar/:id', UsuarioController.desativar);
    app.get('/:id', UsuarioController.buscarPorId);
    app.post('/', UsuarioController.criar);
    app.post('/login-google',async (req, res) => {
        console.log("Recebendo requisição para login com Google");
        await UsuarioController.loginGoogle(req, res);
    });
    app.put('/:id', UsuarioController.atualizar);
    app.delete('/:id', UsuarioController.deletar);
}