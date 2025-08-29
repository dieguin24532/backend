import express from 'express';
import { almacenarLogs } from '../controllers/ticketsMailLogsController.js';

const router = express.Router();

router.post('/webhook', almacenarLogs)

export default router;