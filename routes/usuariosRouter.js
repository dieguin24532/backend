import express from 'express';
import { guardarUsuario, obtenerUsuarios } from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/', obtenerUsuarios);
router.post('/', guardarUsuario);

export default router;