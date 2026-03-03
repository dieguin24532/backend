import express from 'express';
import { obtenerEventos, validarEntrada } from './eventos.controller.js';

const router = express.Router();

router.get('/', obtenerEventos)
router.post('/:idEvento/validar-entrada/:idTicket', validarEntrada);;

export default router