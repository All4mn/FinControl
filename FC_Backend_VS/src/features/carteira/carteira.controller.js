import { AppError } from "../../Errors/AppError.js";

export class CarteiraController {
  constructor(service) {
    this.service = service;

    this.listar = this.listar.bind(this);
    this.listarPorUsuario = this.listarPorUsuario.bind(this);
    this.listarTodas = this.listarTodas.bind(this);
    this.atualizarAdmin = this.atualizarAdmin.bind(this);
    this.buscarPorId = this.buscarPorId.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.deletar = this.deletar.bind(this);
  }

  async listar(req, res) {
    try {
      const carteira = await this.service.findByUsuario(req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao listar carteiras:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async listarPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      if (Number(id_usuario) !== req.usuario.id_usuario) {
        throw new AppError("Acesso negado", 403);
      }
      const carteira = await this.service.findByUsuario(id_usuario);
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao listar carteiras por usuário:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async listarTodas(req, res) {
    try {
      const carteiras = await this.service.findAllWithUsers();
      return res.status(200).send({ sucesso: true, dados: carteiras });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao listar todas as carteiras:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizarAdmin(req, res) {
    try {
      const { id } = req.params;
      const carteira = await this.service.updateAdmin(
        id,
        { nome_carteira: req.body.nome_carteira },
      );
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao atualizar carteira como admin:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const carteira = await this.service.findById(id, req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao buscar carteira:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async criar(req, res) {
    try {
      const novaCarteira = await this.service.create({
        id_usuario: req.usuario.id_usuario,
        nome_carteira: req.body.nome_carteira,
      });
      return res.status(201).send({ sucesso: true, dados: novaCarteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao criar carteira:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const carteira = await this.service.update(
        id,
        { nome_carteira: req.body.nome_carteira },
        req.usuario.id_usuario,
      );
      return res.status(200).send({ sucesso: true, dados: carteira });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao atualizar carteira:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id, req.usuario.id_usuario);
      return res.status(200).send({ sucesso: true, mensagem: "Carteira removida" });
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).send({ sucesso: false, mensagem: err.message });
      }
      console.error("Erro ao deletar carteira:", err);
      return res.status(500).send({ sucesso: false, mensagem: "Erro interno" });
    }
  }
}
