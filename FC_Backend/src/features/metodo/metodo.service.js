// =============================================================================
// models/services/metodo.service.js
// Lógica de negócios para metodo
// =============================================================================

export class MetodoService {
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

  async create({ nome_metodo }) {
    if (!nome_metodo || nome_metodo.trim() === "") {
      throw new Error("Nome do método é obrigatório");
    }

    return await this.repository.create({ nome_metodo });
  }

  async update(id, { nome_metodo }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_metodo || nome_metodo.trim() === "") {
      throw new Error("Nome do método é obrigatório");
    }

    return await this.repository.update(id, { nome_metodo });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }
}
