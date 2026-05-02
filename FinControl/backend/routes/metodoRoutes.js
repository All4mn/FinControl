// =============================================================================
// routes/metodoRoutes.js
// CRUD de métodos de pagamento
// =============================================================================

const express = require('express');
const router = express.Router();
const MetodoController = require('../controllers/metodoController');

router.get('/',       MetodoController.listar);
router.get('/:id',    MetodoController.buscarPorId);
router.post('/',      MetodoController.criar);
router.put('/:id',    MetodoController.atualizar);
router.delete('/:id', MetodoController.deletar);

module.exports = router;
