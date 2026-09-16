import { relations } from "drizzle-orm/relations";
import { carteira, transacao, categoria, conta, metodo, usuario, carteiraHasConta, moeda, statusUsuario } from "./schema";

export const transacaoRelations = relations(transacao, ({one}) => ({
	carteira: one(carteira, {
		fields: [transacao.idCarteira],
		references: [carteira.idCarteira]
	}),
	categoria: one(categoria, {
		fields: [transacao.idCategoria],
		references: [categoria.idCategoria]
	}),
	conta: one(conta, {
		fields: [transacao.idConta],
		references: [conta.idConta]
	}),
	metodo: one(metodo, {
		fields: [transacao.idMetodo],
		references: [metodo.idMetodo]
	}),
}));

export const carteiraRelations = relations(carteira, ({one, many}) => ({
	transacaos: many(transacao),
	usuario_idUsuario: one(usuario, {
		fields: [carteira.idUsuario],
		references: [usuario.idUsuario],
		relationName: "carteira_idUsuario_usuario_idUsuario"
	}),
	usuario_idUsuario: one(usuario, {
		fields: [carteira.idUsuario],
		references: [usuario.idUsuario],
		relationName: "carteira_idUsuario_usuario_idUsuario"
	}),
	carteiraHasContas: many(carteiraHasConta),
}));

export const categoriaRelations = relations(categoria, ({many}) => ({
	transacaos: many(transacao),
}));

export const contaRelations = relations(conta, ({one, many}) => ({
	transacaos: many(transacao),
	carteiraHasContas: many(carteiraHasConta),
	moeda: one(moeda, {
		fields: [conta.idMoeda],
		references: [moeda.idMoeda]
	}),
	usuario: one(usuario, {
		fields: [conta.idUsuario],
		references: [usuario.idUsuario]
	}),
}));

export const metodoRelations = relations(metodo, ({many}) => ({
	transacaos: many(transacao),
}));

export const usuarioRelations = relations(usuario, ({one, many}) => ({
	carteiras_idUsuario: many(carteira, {
		relationName: "carteira_idUsuario_usuario_idUsuario"
	}),
	carteiras_idUsuario: many(carteira, {
		relationName: "carteira_idUsuario_usuario_idUsuario"
	}),
	contas: many(conta),
	statusUsuario: one(statusUsuario, {
		fields: [usuario.idStatusUsuario],
		references: [statusUsuario.idStatusUsuario]
	}),
}));

export const carteiraHasContaRelations = relations(carteiraHasConta, ({one}) => ({
	carteira: one(carteira, {
		fields: [carteiraHasConta.idCarteira],
		references: [carteira.idCarteira]
	}),
	conta: one(conta, {
		fields: [carteiraHasConta.idConta],
		references: [conta.idConta]
	}),
}));

export const moedaRelations = relations(moeda, ({many}) => ({
	contas: many(conta),
}));

export const statusUsuarioRelations = relations(statusUsuario, ({many}) => ({
	usuarios: many(usuario),
}));