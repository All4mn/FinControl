// =============================================================================
// models/transacao.js
// Queries SQL para a tabela de transacao
// =============================================================================

import database from '../config/db.js';

class TransacaoModel {
  async findAll() {
    const response = await database.query('SELECT * FROM transacao ORDER BY data DESC');
    return response.rows;
  }
  
  async archive(id) {
    const response = await database.query(
      `UPDATE transacao 
       SET arquivado = true
       WHERE id_transacao = $1
       RETURNING *`,
      [id]
    );
    return response.rows[0] || null;
  }
  async findById(id) {
    const response = await database.query('SELECT * FROM transacao WHERE id_transacao = $1', [id]);
    return response.rows[0] || null;
  }

  async create({ id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada }) {
    const response = await database.query(
      `INSERT INTO transacao 
        (id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada]
    );
    return response.rows[0];
  }

  async update(id, { id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada }) {
    const response = await database.query(
      `UPDATE transacao 
       SET id_conta = $1, id_categoria = $2, id_metodo = $3, id_carteira = $4, 
           valor = $5, descricao = $6, quitado = $7, arquivado = $8, data = $9, entrada = $10
       WHERE id_transacao = $11
       RETURNING *`,
      [id_conta, id_categoria, id_metodo, id_carteira, valor, descricao, quitado, arquivado, data, entrada, id]
    );
    return response.rows[0] || null;
  }

  async delete(id) {
    const response = await database.query('DELETE FROM transacao WHERE id_transacao = $1', [id]);
    return response.rowCount > 0;
  } //a gente nao deleta as transações, só arquiva. Talvez esse método possa ser removido ou modificado para arquivar a transação em vez de deletar.
}

export default new TransacaoModel();