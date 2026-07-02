// =============================================================================
// models/services/conta.service.js
// Lógica de negócios para conta
// =============================================================================
import { NotFound } from "./conta.error.js";
import { CarteiraRepository } from "../carteira/carteira.repository.js";
import { CarteiraHasContaRepository } from "../carteiraHasConta/carteiraHasConta.repository.js";

export class ContaService {
  constructor(repository) {
    this.repository = repository;
    this.carteiraRepository = new CarteiraRepository();
    this.carteiraHasContaRepository = new CarteiraHasContaRepository();
  }

  async findAll(id_usuario) {
    if (!id_usuario) throw new NotFound("ID do usuário é obrigatório");
    return await this.repository.findAllByUsuario(id_usuario);
  }

  async findById(id, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    return await this.repository.findByIdAndUsuario(id, id_usuario);
  }

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_conta || nome_conta.trim() === "") {
      throw new Error("Nome da conta é obrigatório");
    }
    if (!id_moeda) throw new Error("Moeda não especificada");

    const conta = await this.repository.create({ id_usuario, id_moeda, nome_conta, saldo_conta });

    let carteira = await this.carteiraRepository.findByUsuario(id_usuario);
    if (!carteira) {
      carteira = await this.carteiraRepository.create({
        id_usuario,
        nome_carteira: "Carteira do usuário",
      });
    }

    await this.carteiraHasContaRepository.create({
      id_carteira: carteira.id_carteira,
      id_conta: conta.id_conta,
    });

    return conta;
  }

  async update(id, nome_conta, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_conta || nome_conta.trim() === "") {
      throw new Error("Nome da conta é obrigatório");
    }

    return await this.repository.updateByUsuario(id, nome_conta, id_usuario);
  }

  async arquivar(id, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    return await this.repository.arquivar(id, id_usuario);
  }

  async desarquivar(id, id_usuario) {
    if (!id) throw new Error("Id é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    return await this.repository.desarquivar(id, id_usuario);
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
      throw new NotFound('Usuario sem conta')
    }
    return response
  }
}
