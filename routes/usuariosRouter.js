import express from 'express';
import { guardarUsuario, obtenerUsuarioLogin, obtenerUsuarios } from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/', obtenerUsuarios);
router.get('/login', obtenerUsuarioLogin);

router.post('/', guardarUsuario);

export default router;