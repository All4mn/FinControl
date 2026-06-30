// =============================================================================
// models/services/conta.service.js
// Lógica de negócios para conta
// =============================================================================
import { NotFound } from "./conta.error.js";


export class ContaService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findById(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.findById(id);
  }

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_conta || nome_conta.trim() === "") {
      throw new Error("Nome da conta é obrigatório");
    }

    return await this.repository.create({ id_usuario, id_moeda, nome_conta, saldo_conta });
  }

  async update(id, { id_usuario, id_moeda, nome_conta, saldo_conta }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_conta || nome_conta.trim() === "") {
      throw new Error("Nome da conta é obrigatório");
    }

    return await this.repository.update(id, { id_usuario, id_moeda, nome_conta, saldo_conta });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }

  // Busca todas as contas de um usuário específico
  // Fluxo:
  // 1. Valida se o ID foi fornecido e é um número válido
  // 2. Verifica se o usuário existe no banco de dados
  // 3. Se existe, recupera todas as contas associadas ao usuário
  // 4. Retorna array de contas ou mensagem se não houver contas
  async search(id){
    // Validação do ID: verifica se foi fornecido e se é um número válido
    // Lança erro se o ID estiver faltando ou não for um número
    if(!id || isNaN(id)){  
      throw new NotFound('Id não especificado')
    }
    
    // Verifica se o usuário existe no banco de dados
    const user = await this.repository.findUserById(id)
    if(!user || user.length == 0){
      throw new NotFound('Usuario não encontrado')
    }
    
    // Busca todas as contas do usuário no repository
    const response = await this.repository.search(id)
    
    // Tratamento de resposta:
    // Se o usuário não possui nenhuma conta, retorna mensagem amigável
    // Caso contrário, retorna o array com todos os dados das contas
    if(!response || response.length == 0){
      // return {
        
      //   "data":"Usuário sem Conta",
      //   "verify":false
      // }
      return false
    }
    return response
  }
}
