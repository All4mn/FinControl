// =============================================================================
// models/services/conta.service.js
// Lógica de negócios para conta
// =============================================================================

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
}
