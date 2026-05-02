// =============================================================================
// routes/authRoutes.js
// Rotas de autenticação
// =============================================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// POST /auth/registro  — Registrar novo usuário
router.post('/registro', AuthController.registro);

// POST /auth/login     — Autenticar usuário
router.post('/login', AuthController.login);

// GET  /auth/me        — Dados do usuário logado
router.get('/me', AuthController.me);

module.exports = router;
