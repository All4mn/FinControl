// =============================================================================
// models/services/conta.service.js
// Lógica de negócios para conta
// =============================================================================
import { NotFound, RequiredFieldError } from "./conta.error.js";
import { CarteiraRepository } from "../carteira/carteira.repository.js";
import { CarteiraHasContaRepository } from "../carteiraHasConta/carteiraHasConta.repository.js";

export class ContaService {
  constructor(repository) {
    this.repository = repository;
    this.carteiraRepository = new CarteiraRepository();
    this.carteiraHasContaRepository = new CarteiraHasContaRepository();
  }

  async findAll() {
    const response = await this.repository.findAll();
    if(!response || response.length == 0){
      throw new NotFound('Nenhuma conta encontrada')
    }
    return response;
  }

  async findById(id) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    const response = await this.repository.findById(id);
    if (!response) throw new NotFound("Conta não encontrada");
    return response;
  }

  async create({ id_usuario, id_moeda, nome_conta, saldo_conta }) {
    if (!nome_conta || nome_conta.trim() === "") {
      throw new RequiredFieldError("Nome da conta é obrigatório");
    }
    if(!id_usuario || !id_moeda || saldo_conta === undefined) {
      throw new RequiredFieldError("Todos os campos são obrigatórios: id_usuario, id_moeda, nome_conta, saldo_conta");
    }
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

  async update(id, nome_conta) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    if (!nome_conta || nome_conta.trim() === "") {
      throw new RequiredFieldError("Nome da conta é obrigatório");
    }
    const existingConta = await this.repository.findById(id);
    if (!existingConta) {
      throw new NotFound("Conta não encontrada");
    }
    const response = await this.repository.update(id, nome_conta);
    if (!response) {
      throw new NotFound("Erro ao atualizar a conta");
    }
    return response;
  }

  async arquivar(id) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    const existingConta = await this.repository.findById(id);
    if (!existingConta) {
      throw new NotFound("Conta não encontrada");
    }
    const response = await this.repository.arquivar(id);
    if (!response) {
      throw new NotFound("Erro ao arquivar a conta");
    }
    return response;
  }

  async desarquivar(id) {
    if (!id) throw new RequiredFieldError("Id é obrigatório");
    const existingConta = await this.repository.findById(id);
    if (!existingConta) {
      throw new NotFound("Conta não encontrada");
    }
    const response = await this.repository.desarquivar(id);
    if (!response) {
      throw new NotFound("Erro ao desarquivar a conta");
    }
    return response;
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
      throw new RequiredFieldError('Id não especificado')
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
      throw new NotFound('Usuario sem conta')
    }
    return response
  }
}
