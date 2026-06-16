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

  async search(id){
    if(!id || isNaN(id)){  
      console.log('malha fina');
          
      throw new NotFound('Id não especificado')
    }
    const user = await this.repository.findUserById(id)
    if(!user || user.length == 0){
      throw new NotFound('Usuario não encontrado')
    }
    const response = await this.repository.search(id)
    if(!response || response.length == 0){
      console.log('tetstt');
      
      return {
        "data":"Usuário sem Conta"
      }
    }
    return response
  }
}
