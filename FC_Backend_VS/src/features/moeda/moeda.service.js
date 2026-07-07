// =============================================================================
// src/features/moeda/moeda.service.js
// Lógica de negócios para moeda
// =============================================================================
import { NotFound, RequiredFieldError } from "./moeda.error.js";


export class MoedaService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    const response = await this.repository.findAll();
    if (!response) {
      throw new NotFound("Nenhuma moeda encontrada");
    }
    return response;
  }

  async findById(id) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    const response = await this.repository.findById(id);
    if (!response) {
      throw new NotFound("Moeda não encontrada");
    }
    return response;
  }

  async create(nome_moeda) {
    if (!nome_moeda || nome_moeda.trim() === "") {
      throw new RequiredFieldError("Nome da moeda é obrigatório");
    }
    return await this.repository.create({ nome_moeda });
  }

  async update(id, nome_moeda ) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    if (!nome_moeda || nome_moeda.trim() === "") {
      throw new RequiredFieldError("Nome da moeda é obrigatório");
    }
    const existingMoeda = await this.repository.findById(id);
    if (!existingMoeda) {
      throw new NotFound("Moeda não encontrada");
    }
    const response = await this.repository.update(id, nome_moeda );
      if (!response) {
        throw new NotFound("Erro ao atualizar a moeda");
      }
    return response;
  }

  async delete(id) {
    if (!id) throw new RequiredFieldError("ID é obrigatório");
    return await this.repository.delete(id);
  }
}
