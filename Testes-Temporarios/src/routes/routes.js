import controller from "../controller/controller.js";

// Função que registra as rotas na aplicação Fastify.
// Recebe a instância do app como parâmetro e define os endpoints.
// No padrão MVC, as Routes são responsáveis por mapear URLs para ações do Controller.
// Para replicar: Adicione mais rotas aqui, como POST, PUT, DELETE, seguindo o mesmo padrão.
export async function routes(app) {

    // Define uma rota GET para /usuarios.
    // Quando acessada, chama o método listar do controller.
    // O controller retorna os dados, que são enviados como resposta.
    // Para replicar: Use app.get/post/put/delete(path, handler) para outras rotas.
    // Adicione validação de entrada com schemas do Fastify.
    app.get('/usuarios', async (req, res) => {
        console.log('requisição saindo do routes')
        const usuarios = await controller.listar(res);
    });

    app.get('/usuarios/:id', async(req,res )=>{
        const usuario = await controller.findUserByID(req, res)
    })
}