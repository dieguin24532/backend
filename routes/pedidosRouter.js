import express from 'express';
import { actualizarEmail , obtenerPedidos } from '../controllers/pedidosController.js';

const router = express.Router();

router.get('/', obtenerPedidos);

router.put('/', actualizarEmail);


export default router;
