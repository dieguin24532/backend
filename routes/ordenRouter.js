import express from 'express';
import { recibirActualizaciónPedido } from '../pedidos/pedidos.controller.js';

const router = express.Router();

router.post('/webhook', recibirActualizaciónPedido);


export default router;