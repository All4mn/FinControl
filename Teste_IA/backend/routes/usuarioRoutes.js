// =============================================================================
// routes/usuarioRoutes.js
// CRUD de usuários
// =============================================================================

const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router.get('/',     UsuarioController.listar);
router.get('/:id',  UsuarioController.buscarPorId);
router.put('/:id',  UsuarioController.atualizar);
router.delete('/:id', UsuarioController.deletar);

module.exports = router;
