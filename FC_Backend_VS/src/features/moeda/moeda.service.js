// =============================================================================
// src/features/moeda/moeda.service.js
// Lógica de negócios para moeda
// =============================================================================

export class MoedaService {
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

  async create({ nome_moeda }) {
    if (!nome_moeda || nome_moeda.trim() === "") {
      throw new Error("Nome da moeda é obrigatório");
    }

    return await this.repository.create({ nome_moeda });
  }

  async update(id, { nome_moeda }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_moeda || nome_moeda.trim() === "") {
      throw new Error("Nome da moeda é obrigatório");
    }

    return await this.repository.update(id, { nome_moeda });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }
}