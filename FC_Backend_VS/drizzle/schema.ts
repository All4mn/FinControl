import { pgTable, serial, integer, varchar, jsonb, timestamp, foreignKey, numeric, text, boolean, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const logs = pgTable("logs", {
	idLog: serial("id_log").primaryKey().notNull(),
	idUsuario: integer("id_usuario"),
	operacao: varchar({ length: 10 }).notNull(),
	tabela: varchar({ length: 50 }).notNull(),
	anterior: jsonb(),
	posterior: jsonb(),
	data: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const transacao = pgTable("transacao", {
	idTransacao: serial("id_transacao").primaryKey().notNull(),
	idConta: integer("id_conta").notNull(),
	idCategoria: integer("id_categoria").notNull(),
	idMetodo: integer("id_metodo").notNull(),
	idCarteira: integer("id_carteira"),
	valor: numeric({ precision: 12, scale:  2 }).notNull(),
	descricao: text(),
	quitado: boolean().default(false),
	arquivado: boolean().default(false),
	data: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	entrada: boolean().default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idCarteira],
			foreignColumns: [carteira.idCarteira],
			name: "fk_transacao_carteira"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.idCategoria],
			foreignColumns: [categoria.idCategoria],
			name: "fk_transacao_categoria"
		}),
	foreignKey({
			columns: [table.idConta],
			foreignColumns: [conta.idConta],
			name: "fk_transacao_conta"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idMetodo],
			foreignColumns: [metodo.idMetodo],
			name: "fk_transacao_metodo"
		}),
]);

export const carteira = pgTable("carteira", {
	idCarteira: serial("id_carteira").primaryKey().notNull(),
	idUsuario: integer("id_usuario"),
	nomeCarteira: varchar("nome_carteira", { length: 100 }).notNull(),
	ativo: boolean().default(true).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuario.idUsuario],
			name: "fk_carteira_usuario"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuario.idUsuario],
			name: "carteira_id_usuario_fkey"
		}).onDelete("set null"),
	unique("carteira_unique").on(table.idUsuario),
]);

export const moeda = pgTable("moeda", {
	idMoeda: serial("id_moeda").primaryKey().notNull(),
	nomeMoeda: varchar("nome_moeda", { length: 50 }).notNull(),
	siglaMoeda: varchar("sigla_moeda").notNull(),
});

export const carteiraHasConta = pgTable("carteira_has_conta", {
	idCarteiraHasConta: serial("id_carteira_has_conta").primaryKey().notNull(),
	idCarteira: integer("id_carteira").notNull(),
	idConta: integer("id_conta").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idCarteira],
			foreignColumns: [carteira.idCarteira],
			name: "fk_chc_carteira"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idConta],
			foreignColumns: [conta.idConta],
			name: "fk_chc_conta"
		}).onDelete("cascade"),
	unique("unique_carteira_conta").on(table.idConta, table.idCarteira),
]);

export const metodo = pgTable("metodo", {
	idMetodo: serial("id_metodo").primaryKey().notNull(),
	nomeMetodo: varchar("nome_metodo", { length: 100 }).notNull(),
});

export const categoria = pgTable("categoria", {
	idCategoria: serial("id_categoria").primaryKey().notNull(),
	nomeCategoria: varchar("nome_categoria", { length: 100 }).notNull(),
});

export const conta = pgTable("conta", {
	idConta: serial("id_conta").primaryKey().notNull(),
	idUsuario: integer("id_usuario").notNull(),
	idMoeda: integer("id_moeda").notNull(),
	nomeConta: varchar("nome_conta", { length: 100 }).notNull(),
	saldoConta: numeric("saldo_conta", { precision: 12, scale:  2 }),
	ativo: varchar().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idMoeda],
			foreignColumns: [moeda.idMoeda],
			name: "fk_conta_moeda"
		}),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuario.idUsuario],
			name: "fk_conta_usuario"
		}).onDelete("cascade"),
]);

export const statusUsuario = pgTable("status_usuario", {
	idStatusUsuario: integer("id_status_usuario").primaryKey().notNull(),
	nomeStatusUsuario: varchar("nome_status_usuario"),
});

export const usuario = pgTable("usuario", {
	idUsuario: serial("id_usuario").primaryKey().notNull(),
	nomeUsuario: varchar("nome_usuario", { length: 100 }).notNull(),
	emailUsuario: varchar("email_usuario", { length: 150 }).notNull(),
	senhaUsuario: text("senha_usuario"),
	telefoneUsuario: varchar("telefone_usuario", { length: 20 }),
	googleIdUsuario: varchar("google_id_usuario"),
	idStatusUsuario: integer("id_status_usuario").notNull(),
	isAdmin: boolean("is_admin").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idStatusUsuario],
			foreignColumns: [statusUsuario.idStatusUsuario],
			name: "usuario_status_usuario_fk"
		}),
	unique("usuario_email_usuario_key").on(table.emailUsuario),
]);
