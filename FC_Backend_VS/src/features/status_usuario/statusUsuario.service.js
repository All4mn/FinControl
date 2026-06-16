export class StatusUsuarioService {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return await this.model.findAll();
  }

  async findById(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.model.findById(id);
  }

  async create({ nome_status }) {
    if (!nome_status || nome_status.trim() === "") {
      throw new Error("Nome do status é obrigatório");
    }
    return await this.model.create({ nome_status });
  }

  async update(id, { nome_status }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_status || nome_status.trim() === "") {
      throw new Error("Nome do status é obrigatório");
    }
    return await this.model.update(id, { nome_status });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.model.delete(id);
  }
}