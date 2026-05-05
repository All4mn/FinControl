import database from '../config/db.js';


class logsModel {
    async findAll() {
        const response = await database.query('SELECT * FROM logs ORDER BY id_log ASC');
        return response.rows;
    }
}

export default new logsModel();