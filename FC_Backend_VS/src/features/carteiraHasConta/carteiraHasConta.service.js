export class CarteiraHasContaService {
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

    if(!dados.id_carteira) throw new Error("ID da carteira é obrigatório");
    const carteiraExists = await this.repository.verifyIdCarteiraExistence(dados.id_carteira);
    if (!carteiraExists) throw new Error("ID da carteira não existe");

    if(!dados.id_conta) throw new Error("ID da conta é obrigatório");
    const contaExists = await this.repository.verifyIdContaExistence(dados.id_conta);
    if (!contaExists) throw new Error("ID da conta não existe");

    if (!dados.nome_carteiraHasConta) throw new Error("Nome é obrigatório");
    
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
