import express from 'express';
import { guardarUsuario, obtenerUsuarioLogin, obtenerUsuarios } from './usuarios.controller.js';
import { authMiddleware, requireRole } from '../core/middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, requireRole([1]), obtenerUsuarios);
router.get('/login', requireRole([1,2]), obtenerUsuarioLogin);
router.post('/', authMiddleware, requireRole([1]), guardarUsuario);

export default router;