import express from 'express';
import { obtenerEventos } from "../controllers/eventosController.js"

const router = express.Router();

router.get('/', obtenerEventos)

export default router