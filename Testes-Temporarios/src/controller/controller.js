import usuarios from "../model/model.js";

// Classe Controller que age como intermediário entre Routes e Model.
// No padrão MVC, o Controller processa a lógica de negócio, coordena Model e View (resposta).
// Aqui, recebe a requisição da rota, chama o model para obter dados, e envia a resposta.
// Para replicar: Crie métodos no controller para cada ação (listar, criar, atualizar, deletar).
class controller {
  constructor() {
    // Armazena uma referência ao model de usuários.
    // Permite acesso aos métodos do model para operações de dados.
    // Para replicar: Injete outros models aqui se necessário.
    this.model = usuarios;
  }

  // Método para listar usuários.
  // Recebe o objeto de resposta (res) da rota.
  // Chama findAll do model para buscar dados do banco.
  // Envia os dados como resposta JSON usando res.send().
  // Para replicar: Adicione tratamento de erros (try/catch), validação,
  // paginação, ou lógica adicional antes de enviar a resposta.
  async listar(params) {
    console.log("requisicao recebida no controller");
    const usuarios = await this.model.findAll();
    params.send(usuarios)
  }

  async findUserByID(req,res) {
    const id = req.params.id
    const usuario = await this.model.findUserByID(id)
    res.send(usuario)
  }
}

// Exporta uma instância singleton do controller.
// Para replicar: Em aplicações maiores, considere classes separadas ou injeção.
export default new controller();
