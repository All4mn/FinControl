// =============================================================================
// models/services/logs.service.js
// Lógica de negócios para logs
// =============================================================================

export class LogsService {
  constructor(repository) {
    this.repository = repository;
  }

  async findAll() {
    return await this.repository.findAll();
  }
}
