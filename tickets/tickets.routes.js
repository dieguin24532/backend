import express from 'express';
import { enviarEntrada, obtenerTicketsByEvento, obtenerTickets, verEntrada } from './tickets.controller.js';
import { obtenerLogsByTicketID } from './ticketsMailLogsController.js';

const router = express.Router();


router.get('/', obtenerTickets);
router.get('/evento/:id', obtenerTicketsByEvento);
router.get('/ver-entrada/:id', verEntrada);
router.get('/email-logs/:id', obtenerLogsByTicketID)

router.post('/enviar-entrada/:id', enviarEntrada);

export default router;