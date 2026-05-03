// =============================================================================
// routes/authRoutes.js
// Rotas de autenticação
// =============================================================================

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /auth/registro  — Registrar novo usuário
router.post('/registro', AuthController.registro);

// POST /auth/login     — Autenticar usuário
router.post('/login', AuthController.login);

// GET  /auth/me        — Dados do usuário logado
router.get('/me', authMiddleware, AuthController.me);

module.exports = router;
