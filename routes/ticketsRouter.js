import express from 'express';
import { enviarEntrada, obtenerTickets, verEntrada } from '../controllers/ticketsController.js';
import { obtenerLogsByTicketID } from '../controllers/TicketsMailLogsController.js';

const router = express.Router();


router.get('/', obtenerTickets);
router.get('/ver-entrada/:id', verEntrada);
router.post('/enviar-entrada/:id', enviarEntrada);
router.get('/email-logs/:id', obtenerLogsByTicketID)

export default router;