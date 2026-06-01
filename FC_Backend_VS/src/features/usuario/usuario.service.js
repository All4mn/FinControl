// =============================================================================
// models/services/usuario.service.js
// Lógica de negócios para usuario
// =============================================================================

export class UsuarioService {
  constructor(repository) {
    this.repository = repository;
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

    return await this.repository.create({
      nome_usuario,
      email_usuario,
      senha_usuario,
      telefone_usuario,
    });
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

    return await this.repository.createWithGoogle({
      google_id,
      nome_usuario,
      email_usuario,
      telefone_usuario,
    });
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
    return await this.repository.delete(id);
  }

  async desativar(id) {
    if (!id) throw new Error("ID é obrigatório");
    return await this.repository.desativar(id);
  }
}
