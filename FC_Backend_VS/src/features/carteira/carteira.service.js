import { AppError } from "../../Errors/AppError.js";

export class CarteiraService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll(id_usuario) {
    return await this.repository.findByUsuario(id_usuario);
  }

  async findAllWithUsers() {
    return await this.repository.findAllWithUsers();
  }

  async findById(id, id_usuario) {
    if (!id) throw new AppError("ID é obrigatório", 400);
    const carteira = await this.repository.findById(id);
    if (!carteira) throw new AppError("Carteira não encontrada", 404);
    if (carteira.id_usuario !== Number(id_usuario)) {
      throw new AppError("Acesso negado", 403);
    }
    return carteira;
  }

  async create() {
    throw new AppError(
      "Criação manual de carteira não permitida. A carteira é criada automaticamente com o usuário.",
      403,
    );
  }

  async update(id, { nome_carteira }, id_usuario) {
    if (!id) throw new AppError("ID é obrigatório", 400);
    if (!nome_carteira || nome_carteira.trim() === "") {
      throw new AppError("Nome da carteira é obrigatório", 400);
    }

    const carteira = await this.repository.findById(id);
    if (!carteira) throw new AppError("Carteira não encontrada", 404);
    if (carteira.id_usuario !== Number(id_usuario)) {
      throw new AppError("Acesso negado", 403);
    }

    return await this.repository.update(id, { nome_carteira });
  }

  async updateAdmin(id, { nome_carteira }) {
    if (!id) throw new AppError("ID é obrigatório", 400);
    if (!nome_carteira || nome_carteira.trim() === "") {
      throw new AppError("Nome da carteira é obrigatório", 400);
    }

    const carteira = await this.repository.findById(id);
    if (!carteira) throw new AppError("Carteira não encontrada", 404);

    return await this.repository.update(id, { nome_carteira });
  }

  async delete() {
    throw new AppError(
      "Exclusão manual de carteira não permitida.",
      403,
    );
  }

  async findByUsuario(id_usuario) {
    if (!id_usuario) throw new AppError("ID do usuário é obrigatório", 400);
    return await this.repository.findByUsuario(id_usuario);
  }
}
