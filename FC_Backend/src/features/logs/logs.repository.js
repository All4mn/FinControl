// =============================================================================
// models/repositories/logs.repository.js
// Acesso ao banco de dados para a tabela de logs
// =============================================================================

import database from "../../config/db.js";

export class LogsRepository {
  async findAll() {
    const response = await database.query(
      "SELECT * FROM logs ORDER BY id_log ASC",
    );
    return response.rows;
  }
}
