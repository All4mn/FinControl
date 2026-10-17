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
    if (!id_usuario || !id_moeda || saldo_conta === undefined || saldo_conta === null || String(saldo_conta).trim() === "") {
      throw new RequiredFieldError("Todos os campos são obrigatórios: id_usuario, id_moeda, nome_conta, saldo_conta");
    }
    if (!Number.isFinite(Number(saldo_conta))) {
      throw new RequiredFieldError("O saldo inicial deve ser um número válido");
    }

    // Transação: sem ela, uma falha ao criar carteira/víncio deixava a conta órfã,
    // sem carteira_has_conta, e a conta sumia do saldo consolidado.
    return await this.repository.withTransaction(async (client) => {
      const conta = await this.repository.create(
        { id_usuario, id_moeda, nome_conta, saldo_conta },
        client,
      );
      const carteiras = await this.carteiraRepository.findByUsuario(id_usuario, client);
      let carteira = carteiras[0];
      if (!carteira) {
        carteira = await this.carteiraRepository.create(
          {
            id_usuario,
            nome_carteira: "Carteira do usuário",
          },
          client,
        );
      }

      await this.carteiraHasContaRepository.create(
        {
          id_carteira: carteira.id_carteira,
          id_conta: conta.id_conta,
        },
        client,
      );

      return conta;
    });
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

// apenasAtivas: resultado vazio significa "sem conta ativa", não erro. O 404
  // aqui colocava o frontend de transações em falha permanente ao arquivar a
  // única conta do usuário.
  async search(id, apenasAtivas = false){
    if(!id || isNaN(id)){
      throw new RequiredFieldError('Id não especificado')
    }

    const user = await this.repository.findUserById(id)
    if(!user || user.length == 0){
      throw new NotFound('Usuario não encontrado')
    }

    const response = await this.repository.search(id, apenasAtivas)

    if(!response || response.length == 0){
      if (apenasAtivas) {
        return [];
      }
      throw new NotFound('Usuario sem conta')
    }
    return response
  }
}

