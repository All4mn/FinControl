export class CarteiraService {
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

  async create({ id_usuario, nome_carteira }) {
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_carteira || nome_carteira.trim() === "") {
      throw new Error("Nome da carteira é obrigatório");
    }

    return await this.repository.create({ id_usuario, nome_carteira });
  }

  async update(id, { id_usuario, nome_carteira }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    if (!nome_carteira || nome_carteira.trim() === "") {
      throw new Error("Nome da carteira é obrigatório");
    }

    return await this.repository.update(id, { id_usuario, nome_carteira });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }

  async findByUsuario(id_usuario) {
    if (!id_usuario) throw new Error("ID do usuário é obrigatório");
    return await this.repository.findByUsuario(id_usuario);
  }
}
