import 'dotenv/config';
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

//OpenAPI
import { swaggerSpec } from './swaggerConfig.js';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from "./middleware/error.middleware.js";

console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});


//Instancio en la variable app el middleware de express
const app = express();
const port = process.env.PORT || 3000;

//Habilitar recibir peticiones HTTP con body
const allowedOrigins = [
  'http://localhost:4200',
  'https://ticket.galaacademy.com'
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS Request Origin:', origin);
    // Permitir requests sin origin (Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    } 
    console.log('CORS Request Blocked:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['Set-Cookie']
}));
app.disable('x-powered-by');
app.use(express.json());
app.use(cookieParser());
console.log('hola');

//Sincronizar la base de datos
try {
  
  await dbTickets.authenticate();
  await db.sync();
  console.log('Conexión con la base de datos exitosa');
} catch (error) {
  console.log('Error al conectarse con la base de datos:' + error);
}

try {
  await db.authenticate();
  console.log('se conecto');
} catch(error) {
  console.log('no se conecto');
}

//Routing
app.use('/auth', authRouter);
app.use('/orden', ordenRouter);
app.use('/sendgrid', sendgridRouter);
app.use('/eventos', verificarToken([1,2]), eventosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/pedidos', verificarToken([1,2]), pedidosRouter);
app.use('/tickets', verificarToken([1,2]), ticketsRouter);

// Servir la carpeta "docs" como estática
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Solución para Render: usar rutas absolutas y verificar la carpeta
app.use("/docs", express.static(path.join(__dirname, "docs")));

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//Middleware de errores
app.use(errorHandler);
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Programa escuchando en el puerto ${port}`);
});
