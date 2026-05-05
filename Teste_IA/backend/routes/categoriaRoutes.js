// =============================================================================
// routes/categoriaRoutes.js
// CRUD de categorias
// =============================================================================

const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoriaController');

router.get('/',       CategoriaController.listar);
router.get('/:id',    CategoriaController.buscarPorId);
router.post('/',      CategoriaController.criar);
router.put('/:id',    CategoriaController.atualizar);
router.delete('/:id', CategoriaController.deletar);

module.exports = router;
