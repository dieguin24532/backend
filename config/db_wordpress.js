//Importa ORM Sequelize que maneja la conexión y operaciones con la base de datos
import Sequelize from 'sequelize';

/**
 * Instancia de Sequelize configurada para la base de datos de galaAcademy
 * Los valores de conexión se toman de variables de entorno
 */
const dbTickets = new Sequelize(
    process.env.BD_TICKETS_NOMBRE, 
    process.env.BD_TICKETS_USER, 
    process.env.BD_TICKETS_PASS,

    {
        host: process.env.BD_TICKETS_HOST,
        port: process.env.BD_TICKETS_PORT,
        dialect: 'mysql',
        logging: false, // Desactiva el log de consultas SQL

        define: {
            timestamps: false, // Evita que Sequelize agregue campos createdAt/updatedAt por defecto
        },
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,

            idle: 1000
        },
        operatorAliases: false
    }
);

export default dbTickets;