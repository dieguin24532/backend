import express from 'express';
import { enviarEntrada, obtenerTicketsByEvento, obtenerTickets, verEntrada, validarEntrada } from '../controllers/ticketsController.js';
import { obtenerLogsByTicketID } from '../controllers/ticketsMailLogsController.js';

const router = express.Router();


router.get('/', obtenerTickets);
router.get('/evento/:id', obtenerTicketsByEvento);
router.get('/ver-entrada/:id', verEntrada);
router.get('/email-logs/:id', obtenerLogsByTicketID)

router.post('/enviar-entrada/:id', enviarEntrada);
router.post('/validar-entrada/', validarEntrada);

export default router;