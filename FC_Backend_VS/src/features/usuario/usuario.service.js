// =============================================================================
// models/services/usuario.service.js
// Lógica de negócios para usuario
// =============================================================================

import { createCrypto } from "google-auth-library/build/src/crypto/crypto.js";
import { CarteiraRepository } from "../carteira/carteira.repository.js";
import { ContaRepository } from "../conta/conta.repository.js";

import crypto from "crypto";

const createHash = async () => {
  const hash = crypto.randomBytes(3).toString("hex");
  return hash;
};

export class UsuarioService {
  constructor(repository) {
    this.repository = repository;
    this.carteiraRepository = new CarteiraRepository();
    this.contaRepository = new ContaRepository();
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

  async create({
    nome_usuario,
    email_usuario,
    senha_usuario,
    telefone_usuario,
  }) {
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
    await this.contaRepository.archiveByUsuario(id);
    await this.carteiraRepository.archiveByUsuario(id);
    return await this.repository.delete(id);
  }

  async desativar(id) {
    if (!id) throw new Error("ID é obrigatório");
    await this.contaRepository.archiveByUsuario(id);
    await this.carteiraRepository.archiveByUsuario(id);
    return await this.repository.desativar(id);
  }

  async getLid(lid) {
    if (!lid) throw new Error("Lid não oferecido");
    const response = await this.repository.getLid(lid);
    if (!response || response.length == 0) {
      console.log("A pessoa não tem lid, criando um agora");
      const insert = await this.repository.insertLid(lid);

      return insert;
    }
    return response;
  }

  async insertUserToken(id) {
    if (!id) throw new Error("Token não especificado");
    const hash = await createHash();
    console.log(hash);

    const response = await this.repository.insertUserToken(id, hash);
    if (!response || response.length == 0)
      throw new Error("Erro ao criar um token");
    return response;
  }

  async getLidById(id) {
    if (!id || isNaN(id)) throw new Error("Id invalido ou inexistente");
    const response = await this.repository.getLidById(id);
    console.log(response);
    
    if (!response || response.length == 0) {
      console.log('usuario nao tem lid nem hash, inserindo uma hash temporaria');
      
      const hash = await createHash();
      const insert = await this.repository.insertUserToken(id, hash);
      if (!insert || insert.length == 0)
        throw new Error("erro ao vincular uma hash ao usuario");
      console.log('hash inserida: ', hash);
      
      return insert;
    }
    return response;
  }
}
