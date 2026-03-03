import express from 'express';
import { almacenarLogs } from '../tickets/ticketsMailLogsController.js';

const router = express.Router();

router.post('/webhook', almacenarLogs)

export default router;