import express from 'express';
import { recibirActualizaciónPedido } from '../controllers/pedidosController.js';

const router = express.Router();

router.post('/webhook', recibirActualizaciónPedido);


export default router;