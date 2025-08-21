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
//Middleware
import { verificarToken } from './middleware/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


//Instancio en la variable app el middleware de express
const app = express();
const port = process.env.PORT || 3000;

//Habilitar recibir peticiones HTTP con body
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//Sincronizar la base de datos
try {
  await db.authenticate();
  await db.sync();
  console.log('conexión con la base de datos exitosa');
} catch (error) {
  console.log('Error al conectarse con la base de datos:' + error);
}

//Routing
app.use('/auth', authRouter);
app.use('/orden', ordenRouter);
app.use('/eventos', verificarToken ,eventosRouter);
app.use('/usuarios', verificarToken ,usuariosRouter);
app.use('/pedidos', verificarToken ,pedidosRouter);
app.use('/tickets', verificarToken ,ticketsRouter);

app.listen(port, () => {
    console.log(`Programa escuchando en el puerto ${port}`);
})
