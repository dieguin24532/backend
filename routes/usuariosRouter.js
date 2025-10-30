import express from 'express';
import { guardarUsuario, obtenerUsuarioLogin, obtenerUsuarios } from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',verificarToken([1]), obtenerUsuarios);
router.get('/login', verificarToken([1,2]), obtenerUsuarioLogin);

router.post('/', verificarToken([1]), guardarUsuario);

export default router;