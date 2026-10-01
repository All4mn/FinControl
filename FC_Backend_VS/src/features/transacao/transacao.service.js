// =============================================================================
// models/services/transacao.service.js
// Lógica de negócios para transacao
// =============================================================================

import { AppError } from "../../Errors/AppError.js";

export class TransacaoService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async archive(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.archive(id);
  }

  async findById(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.findById(id);
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
  }) {
    if (!id_conta) throw new AppError("ID da conta é obrigatório", 400);
    if (valor === undefined || valor === null) {
      throw new AppError("Valor da transação é obrigatório", 400);
    }
    if (!descricao || descricao.trim() === "") {
      throw new AppError("Descrição é obrigatória", 400);
    }

    return await this.repository.create({
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
    });
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
  ) {
    if (!id) throw new Error("ID é obrigatório");
    if (!id_conta) throw new Error("ID da conta é obrigatório");
    if (valor === undefined || valor === null) {
      throw new Error("Valor da transação é obrigatório");
    }
    if (!descricao || descricao.trim() === "") {
      throw new Error("Descrição é obrigatória");
    }

    return await this.repository.update(id, {
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
    });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.delete(id);
  }
}
