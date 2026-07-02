import { AppError } from "../../Errors/AppError.js";

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

  async create({ nome_status_usuario }) {
    if (!nome_status_usuario || nome_status_usuario.trim() === "") {
      throw new Error("Nome do status é obrigatório");
    }
    return await this.model.create({ nome_status_usuario });
  }

  async update(id, { nome_status_usuario }) {
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_status_usuario || nome_status_usuario.trim() === "") {
      throw new Error("Nome do status é obrigatório");
    }
    return await this.model.update(id, { nome_status_usuario });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");

    const totalUsuarios = await this.model.countUsersByStatusId(id);
    if (totalUsuarios > 0) {
      throw new AppError(
        `Não é possivel excluir pois ${totalUsuarios} usuário${totalUsuarios > 1 ? "s" : ""} tem esse status`,
        400
      );
    }

    return await this.model.delete(id);
  }
}