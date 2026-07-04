// =============================================================================
// models/services/usuario.service.js
// Lógica de negócios para usuario
// =============================================================================

import { CarteiraRepository } from "../carteira/carteira.repository.js";

export class UsuarioService {
  constructor(repository) {
    this.repository = repository;
    this.carteiraRepository = new CarteiraRepository();
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findByLogin({ email_usuario, senha_usuario }) {
    if (!email_usuario || email_usuario.trim() === "") {
      throw new Error("E-mail é obrigatório para login");
    }
    if (!senha_usuario || senha_usuario.trim() === "") {
      throw new Error("Senha é obrigatória para login");
    }

    return await this.repository.findByLogin({ email_usuario, senha_usuario });
  }

  async findById(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.findById(id);
  }

  async findByGoogleId(googleId) {
    if (!googleId) throw new Error("Google ID é obrigatório");
    return await this.repository.findByGoogleId(googleId);
  }

  async create({ nome_usuario, email_usuario, senha_usuario, telefone_usuario }) {
    if (!nome_usuario || nome_usuario.trim() === "") {
      throw new Error("Nome de usuário é obrigatório");
    }
    if (!email_usuario || email_usuario.trim() === "") {
      throw new Error("E-mail é obrigatório");
    }
    if (!senha_usuario || senha_usuario.trim() === "") {
      throw new Error("Senha é obrigatória");
    }

    const novoUsuario = await this.repository.create({
      nome_usuario,
      email_usuario,
      senha_usuario,
      telefone_usuario,
    });

    await this.carteiraRepository.create({
      id_usuario: novoUsuario.id_usuario,
      nome_carteira: "Carteira do usuário",
    });

    return novoUsuario;
  }

  async buscarPorEmail(email) {
    if (!email || email.trim() === "") {
      throw new Error("E-mail é obrigatório");
    }
    return await this.repository.buscarPorEmail(email);
  }

  async createWithGoogle({
    google_id,
    nome_usuario,
    email_usuario,
    telefone_usuario = null,
  }) {
    if (!google_id) throw new Error("Google ID é obrigatório");
    if (!nome_usuario || nome_usuario.trim() === "") {
      throw new Error("Nome de usuário é obrigatório");
    }
    if (!email_usuario || email_usuario.trim() === "") {
      throw new Error("E-mail é obrigatório");
    }

    const novoUsuario = await this.repository.createWithGoogle({
      google_id,
      nome_usuario,
      email_usuario,
      telefone_usuario,
    });

    await this.carteiraRepository.create({
      id_usuario: novoUsuario.id_usuario,
      nome_carteira: "Carteira do usuário",
    });

    return novoUsuario;
  }

  async update(
    id,
    { nome_usuario, email_usuario, senha_usuario, telefone_usuario },
  ) {
    if (!id) throw new Error("ID é obrigatório");
    if (!nome_usuario || nome_usuario.trim() === "") {
      throw new Error("Nome de usuário é obrigatório");
    }
    if (!email_usuario || email_usuario.trim() === "") {
      throw new Error("E-mail é obrigatório");
    }

    return await this.repository.update(id, {
      nome_usuario,
      email_usuario,
      senha_usuario,
      telefone_usuario,
    });
  }

  async delete(id) {
    if (!id) throw new Error("ID é obrigatório");
    await this.carteiraRepository.archiveByUsuario(id);
    return await this.repository.delete(id);
  }

  async desativar(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.desativar(id);
  }
}
