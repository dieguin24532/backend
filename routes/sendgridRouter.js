import express from 'express';
import { almacenarLogs } from '../controllers/TicketsMailLogsController.js';

const router = express.Router();

router.post('/webhook', almacenarLogs)

export default router;