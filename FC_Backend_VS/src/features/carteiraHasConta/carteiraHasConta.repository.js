// =============================================================================
// src/features/carteiraHasConta/carteiraHasConta.repository.js
// Acesso ao banco de dados para a tabela de carteira_has_conta (via Drizzle ORM)
// =============================================================================

import { eq, desc } from "drizzle-orm";
import { db } from "../../config/drizzle.js";
import {
  carteiraHasConta,
  carteira,
  conta,
  usuario,
  moeda,
} from "../../db/schema.js";

// Converte chaves camelCase (retorno do Drizzle) para snake_case,
// mantendo o mesmo formato que o restante da aplicação espera.
const toSnakeCase = (value) =>
  value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const mapRow = (row) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toSnakeCase(key), value]),
  );

const mapRows = (rows) => rows.map(mapRow);

// Remove campos undefined antes de insert/update,
// para não enviar "undefined" ao banco via Drizzle.
const semUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export class CarteiraHasContaRepository {
  async findAll() {
    const rows = await db
      .select({
        id_carteira_has_conta: carteiraHasConta.idCarteiraHasConta,
        id_carteira: carteiraHasConta.idCarteira,
        id_conta: carteiraHasConta.idConta,
        nome_carteira: carteira.nomeCarteira,
        nome_conta: conta.nomeConta,
        nome_usuario: usuario.nomeUsuario,
        saldo_conta: conta.saldoConta,
        nome_moeda: moeda.nomeMoeda,
      })
      .from(carteiraHasConta)
      .innerJoin(carteira, eq(carteiraHasConta.idCarteira, carteira.idCarteira))
      .innerJoin(conta, eq(carteiraHasConta.idConta, conta.idConta))
      .innerJoin(usuario, eq(carteira.idUsuario, usuario.idUsuario))
      .innerJoin(moeda, eq(conta.idMoeda, moeda.idMoeda))
      .orderBy(desc(carteiraHasConta.idCarteiraHasConta));
    return rows;
  }

  async findById(id) {
    const rows = await db
      .select()
      .from(carteiraHasConta)
      .where(eq(carteiraHasConta.idCarteiraHasConta, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async verifyIdCarteiraExistence(id) {
    const rows = await db
      .select()
      .from(carteira)
      .where(eq(carteira.idCarteira, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async verifyIdContaExistence(id) {
    const rows = await db
      .select()
      .from(conta)
      .where(eq(conta.idConta, id));
    return rows[0] ? mapRow(rows[0]) : null;
  }

  // 'client' opcional: roda dentro da transação de conta.service.create.
  async create(dados, client = null) {
    const executor = client || database;
    const response = await executor.query(
      `INSERT INTO carteira_has_conta (id_carteira, id_conta) VALUES ($1, $2) RETURNING *`,
      [dados.id_carteira, dados.id_conta]
    );
    return response.rows[0];
  }

  async update(id, dados) {
    const rows = await db
      .update(carteiraHasConta)
      .set(
        semUndefined({
          idCarteira: dados.id_carteira,
          idConta: dados.id_conta,
        }),
      )
      .where(eq(carteiraHasConta.idCarteiraHasConta, id))
      .returning();
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const rows = await db
      .delete(carteiraHasConta)
      .where(eq(carteiraHasConta.idCarteiraHasConta, id))
      .returning({
        id_carteira_has_conta: carteiraHasConta.idCarteiraHasConta,
      });
    return rows.length > 0;
  }
}
