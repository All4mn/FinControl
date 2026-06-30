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

  async findFiltered() {
    const response = await this.repository.findFiltered()
    if(!response){
      throw new Error("response nao encontrado")
    }
    return response
  }
}
