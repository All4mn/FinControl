import logsModel from '../models/logs.js';

const logsController = {
    async listar(req, res) {
        try {
            const logs = await logsModel.findAll();
            return res.status(200).send({ sucesso: true, dados: logs });
        } catch (err) {
            return res.status(500).send({ sucesso: false, mensagem: 'Erro interno' });
        }
    }
};


export default logsController;
