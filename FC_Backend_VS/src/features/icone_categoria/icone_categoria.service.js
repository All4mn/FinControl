export class Icone_categoriaService {
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

  async create(dados) {
    if (!dados.nome_icone_categoria) throw new Error("Nome é obrigatório");
    return await this.repository.create(dados);
  }

  async update(id, dados) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.update(id, dados);
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }
}
