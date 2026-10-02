// =============================================================================
// models/services/transacao.service.js
// Lógica de negócios para transacao
// =============================================================================

export class TransacaoService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(id_usuario) {
    return await this.repository.findAll(id_usuario);
  }

  async archive(id, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.archive(id, id_usuario);
  }

  async findById(id, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.findById(id, id_usuario);
  }

  async create({
    id_conta,
    id_categoria,
    id_metodo,
    id_carteira,
    valor,
    descricao,
    quitado,
    arquivado,
    data,
    entrada,
  }, id_usuario) {
    if (!id_conta) throw new Error("ID da conta é obrigatório");
    if (valor === undefined || valor === null) {
      throw new Error("Valor da transação é obrigatório");
    }
    if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
      throw new Error("O valor da transação deve ser maior que zero");
    }
    if (!descricao || descricao.trim() === "") {
      throw new Error("Descrição é obrigatória");
    }
    if (!data || Number.isNaN(new Date(data).getTime())) {
      throw new Error("Data da transação é obrigatória");
    }

    return await this.repository.create({
      id_conta,
      id_categoria,
      id_metodo,
      id_carteira,
      valor,
      descricao,
      quitado: quitado === true || quitado === "true",
      arquivado: false,
      data,
      entrada: entrada === true || entrada === "true",
    }, id_usuario);
  }

  async update(
    id,
    {
      id_conta,
      id_categoria,
      id_metodo,
      id_carteira,
      valor,
      descricao,
      quitado,
      arquivado,
      data,
      entrada,
    },
    id_usuario,
  ) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_conta) throw new Error("ID da conta é obrigatório");
    if (valor === undefined || valor === null) {
      throw new Error("Valor da transação é obrigatório");
    }
    if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
      throw new Error("O valor da transação deve ser maior que zero");
    }
    if (!descricao || descricao.trim() === "") {
      throw new Error("Descrição é obrigatória");
    }
    if (!data || Number.isNaN(new Date(data).getTime())) {
      throw new Error("Data da transação é obrigatória");
    }

    return await this.repository.update(id, {
      id_conta,
      id_categoria,
      id_metodo,
      id_carteira,
      valor,
      descricao,
      quitado: quitado === true || quitado === "true",
      arquivado: arquivado === true || arquivado === "true",
      data,
      entrada: entrada === true || entrada === "true",
    }, id_usuario);
  }

  async delete(id, id_usuario) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id, id_usuario);
  }
}
