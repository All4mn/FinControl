// =============================================================================
// models/services/transacao.service.js
// Lógica de negócios para transacao
// =============================================================================
import { AppError } from "../../Errors/AppError.js";

const validarId = (id) => {
  if (!/^[1-9]\d*$/.test(String(id))) {
    throw new AppError("ID inválido", 400);
  }
};

import { AppError } from "../../Errors/AppError.js";

export class TransacaoService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(id_usuario) {
    return await this.repository.findAll(id_usuario);
  }

  async findArchived(id_usuario) {
    return await this.repository.findArchived(id_usuario);
  }

  async archive(id, id_usuario) {
    validarId(id);
    return await this.repository.archive(id, id_usuario);
  }

  async restore(id, id_usuario) {
    validarId(id);
    return await this.repository.restore(id, id_usuario);
  }

  async findById(id, id_usuario) {
    validarId(id);
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
    if (!id_usuario) throw new AppError("Usuário não autenticado", 401);
    if (!id_conta) throw new AppError("Selecione uma conta", 400);
    if (valor === undefined || valor === null) {
      throw new AppError("Informe o valor da transação", 400);
    }
    if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
      throw new AppError("O valor da transação deve ser maior que zero", 400);
    }
    if (!descricao || descricao.trim() === "") {
      throw new AppError("Informe a descrição da transação", 400);
    }
    if (!data || Number.isNaN(new Date(data).getTime())) {
      throw new AppError("Informe uma data válida para a transação", 400);
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
    validarId(id);
    if (!id_usuario) throw new AppError("Usuário não autenticado", 401);
    if (!id_conta) throw new AppError("Selecione uma conta", 400);
    if (valor === undefined || valor === null) {
      throw new AppError("Informe o valor da transação", 400);
    }
    if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
      throw new AppError("O valor da transação deve ser maior que zero", 400);
    }
    if (!descricao || descricao.trim() === "") {
      throw new AppError("Informe a descrição da transação", 400);
    }
    if (!data || Number.isNaN(new Date(data).getTime())) {
      throw new AppError("Informe uma data válida para a transação", 400);
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
    validarId(id);
    return await this.repository.delete(id, id_usuario);
  }
}
