-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "logs" (
	"id_log" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer,
	"operacao" varchar(10) NOT NULL,
	"tabela" varchar(50) NOT NULL,
	"anterior" jsonb,
	"posterior" jsonb,
	"data" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "transacao" (
	"id_transacao" serial PRIMARY KEY NOT NULL,
	"id_conta" integer NOT NULL,
	"id_categoria" integer NOT NULL,
	"id_metodo" integer NOT NULL,
	"id_carteira" integer,
	"valor" numeric(12, 2) NOT NULL,
	"descricao" text,
	"quitado" boolean DEFAULT false,
	"arquivado" boolean DEFAULT false,
	"data" timestamp DEFAULT CURRENT_TIMESTAMP,
	"entrada" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carteira" (
	"id_carteira" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer,
	"nome_carteira" varchar(100) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "carteira_unique" UNIQUE("id_usuario")
);
--> statement-breakpoint
CREATE TABLE "moeda" (
	"id_moeda" serial PRIMARY KEY NOT NULL,
	"nome_moeda" varchar(50) NOT NULL,
	"sigla_moeda" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carteira_has_conta" (
	"id_carteira_has_conta" serial PRIMARY KEY NOT NULL,
	"id_carteira" integer NOT NULL,
	"id_conta" integer NOT NULL,
	CONSTRAINT "unique_carteira_conta" UNIQUE("id_conta","id_carteira")
);
--> statement-breakpoint
CREATE TABLE "metodo" (
	"id_metodo" serial PRIMARY KEY NOT NULL,
	"nome_metodo" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categoria" (
	"id_categoria" serial PRIMARY KEY NOT NULL,
	"nome_categoria" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conta" (
	"id_conta" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"id_moeda" integer NOT NULL,
	"nome_conta" varchar(100) NOT NULL,
	"saldo_conta" numeric(12, 2),
	"ativo" varchar DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "status_usuario" (
	"id_status_usuario" integer PRIMARY KEY NOT NULL,
	"nome_status_usuario" varchar
);
--> statement-breakpoint
CREATE TABLE "usuario" (
	"id_usuario" serial PRIMARY KEY NOT NULL,
	"nome_usuario" varchar(100) NOT NULL,
	"email_usuario" varchar(150) NOT NULL,
	"senha_usuario" text,
	"telefone_usuario" varchar(20),
	"google_id_usuario" varchar,
	"id_status_usuario" integer NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "usuario_email_usuario_key" UNIQUE("email_usuario")
);
--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "fk_transacao_carteira" FOREIGN KEY ("id_carteira") REFERENCES "public"."carteira"("id_carteira") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "fk_transacao_categoria" FOREIGN KEY ("id_categoria") REFERENCES "public"."categoria"("id_categoria") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "fk_transacao_conta" FOREIGN KEY ("id_conta") REFERENCES "public"."conta"("id_conta") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transacao" ADD CONSTRAINT "fk_transacao_metodo" FOREIGN KEY ("id_metodo") REFERENCES "public"."metodo"("id_metodo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteira" ADD CONSTRAINT "fk_carteira_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteira" ADD CONSTRAINT "carteira_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteira_has_conta" ADD CONSTRAINT "fk_chc_carteira" FOREIGN KEY ("id_carteira") REFERENCES "public"."carteira"("id_carteira") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carteira_has_conta" ADD CONSTRAINT "fk_chc_conta" FOREIGN KEY ("id_conta") REFERENCES "public"."conta"("id_conta") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conta" ADD CONSTRAINT "fk_conta_moeda" FOREIGN KEY ("id_moeda") REFERENCES "public"."moeda"("id_moeda") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conta" ADD CONSTRAINT "fk_conta_usuario" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id_usuario") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_status_usuario_fk" FOREIGN KEY ("id_status_usuario") REFERENCES "public"."status_usuario"("id_status_usuario") ON DELETE no action ON UPDATE no action;
*/