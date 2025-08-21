import express from 'express';
import { enviarEntrada, obtenerTickets, verEntrada } from '../controllers/ticketsController.js';

const router = express.Router();


router.get('/', obtenerTickets);
router.get('/ver-entrada/:id', verEntrada);
router.post('/enviar-entrada/:id', enviarEntrada);

export default router;