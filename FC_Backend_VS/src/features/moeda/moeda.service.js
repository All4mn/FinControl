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

  async create(data) {
  if (!data.nome_moeda?.trim()) throw new Error("Nome da moeda é obrigatório");

  // Validação de duplicidade
  const existe = await this.repository.findByName(data.nome_moeda.trim());
  if (existe) throw new Error("Já existe uma moeda cadastrada com este nome.");

  return await this.repository.create(data);
  }

  async update(id, data) {
    if (!id) throw new Error("ID é obrigatório");
    if (!data.nome_moeda?.trim()) throw new Error("Nome da moeda é obrigatório");

    // Validação de duplicidade ao editar (ignora a própria moeda que está sendo editada)
    const existe = await this.repository.findByName(data.nome_moeda.trim());
    if (existe && existe.id_moeda !== Number(id)) {
      throw new Error("Já existe outra moeda cadastrada com este nome.");
    }

    return await this.repository.update(id, data);
  }

async delete(id) {
  if (!id) throw new Error("ID é obrigatório");

  // Verifica se a moeda está sendo usada em alguma conta
  const emUso = await this.repository.hasConnections(id);
  if (emUso) {
    throw new Error("Não é possível excluir esta moeda pois ela já está vinculada a uma conta ativa.");
  }

  return await this.repository.delete(id);
}


  }
