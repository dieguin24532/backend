import path from "path";
import { fileURLToPath } from "url";
//Importo express
import db from './config/db.js';
import express from 'express';
//Rutas
import pedidosRouter from './routes/pedidosRouter.js';
import ticketsRouter from './routes/ticketsRouter.js';
import ordenRouter from './routes/ordenRouter.js';
import eventosRouter from './routes/eventosRouter.js';
import authRouter from './routes/authRouter.js';
import usuariosRouter from './routes/usuariosRouter.js';
import sendgridRouter from './routes/sendgridRouter.js';
//Middleware
import { verificarToken } from './middleware/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dbTickets from "./config/db_wordpress.js";

//Instancio en la variable app el middleware de express
const app = express();
const port = process.env.PORT || 3000;

//Habilitar recibir peticiones HTTP con body
app.use(cors({
  origin: ['http://localhost:4200', 'https://ticket.galaacademy.com'], // Dominio del frontend
  credentials: true,              // Permitir envío de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],   // Cabeceras permitidas
}));
app.disabled('x-powered-by');
app.use(express.json());
app.use(cookieParser());

//Sincronizar la base de datos
try {
  await db.authenticate();
  await dbTickets.authenticate();
  await db.sync();
  console.log('Conexión con la base de datos exitosa');
} catch (error) {
  console.log('Error al conectarse con la base de datos:' + error);
}

//Routing
app.use('/auth', authRouter);
app.use('/orden', ordenRouter);
app.use('/sendgrid', sendgridRouter);
app.use('/eventos', verificarToken, eventosRouter);
app.use('/usuarios', verificarToken, usuariosRouter);
app.use('/pedidos', verificarToken, pedidosRouter);
app.use('/tickets', verificarToken, ticketsRouter);

// Servir la carpeta "docs" como estática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Solución para Render: usar rutas absolutas y verificar la carpeta
app.use("/docs", express.static(path.join(__dirname, "docs")));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Programa escuchando en el puerto ${port}`);
});
