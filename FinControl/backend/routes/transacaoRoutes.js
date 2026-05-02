// =============================================================================
// routes/transacaoRoutes.js
// CRUD de transações + resumo financeiro
// =============================================================================

const express = require('express');
const router = express.Router();
const TransacaoController = require('../controllers/transacaoController');

router.get('/resumo', TransacaoController.resumo);  // deve vir antes de /:id
router.get('/',       TransacaoController.listar);
router.get('/:id',    TransacaoController.buscarPorId);
router.post('/',      TransacaoController.criar);
router.put('/:id',    TransacaoController.atualizar);
router.delete('/:id', TransacaoController.deletar);

module.exports = router;
