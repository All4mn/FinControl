// =============================================================================
// routes/contaRoutes.js
// CRUD de contas bancárias
// =============================================================================

const express = require('express');
const router = express.Router();
const ContaController = require('../controllers/contaController');

router.get('/',       ContaController.listar);
router.get('/:id',    ContaController.buscarPorId);
router.post('/',      ContaController.criar);
router.put('/:id',    ContaController.atualizar);
router.delete('/:id', ContaController.deletar);

module.exports = router;
