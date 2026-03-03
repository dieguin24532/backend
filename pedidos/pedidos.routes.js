import express from 'express';
import { actualizarEmail , obtenerPedidos } from './pedidos.controller.js';

const router = express.Router();

router.get('/', obtenerPedidos);

router.put('/', actualizarEmail);     

export default router;
