// =============================================================================
// models/services/categoria.service.js
// Lógica de negócios para categoria
// =============================================================================

export class CategoriaService {
  constructor(model) {
    this.model = model;
  }
  async findAll() {
    // Aqui você pode adicionar validações e transformações de dados se necessário
    return await this.model.findAll();
  }

  async findById(id) {
    // Aqui você pode adicionar validações
    if (!id) throw new Error("ID é obrigatório");
    return await this.model.findById(id);
  }

  async create({ nome_categoria }) {
    // Aqui você pode adicionar validações de negócio
    if (!nome_categoria || nome_categoria.trim() === "") {
      throw new Error("Nome da categoria é obrigatório");
    }

    return await this.model.create({ nome_categoria });
  }

  async update(id, { nome_categoria }) {
    // Validações de negócio
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_categoria || nome_categoria.trim() === "") {
      throw new Error("Nome da categoria é obrigatório");
    }

    return await this.model.update(id, { nome_categoria });
  }

  async delete(id) {
    // Validações de negócio
    if (!id) throw new Error("ID é obrigatório");

    return await this.model.delete(id);
  }
}
