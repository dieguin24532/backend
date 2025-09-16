//Importa ORM Sequelize que maneja la conexión y operaciones con la base de datos
import Sequelize from 'sequelize';

/**
 * Instancia de Sequelize configurada para la base de datos de la aplicación web
 * Los valores de conexión se toman de variables de entorno
 */
const db = new Sequelize(
    process.env.BD_NOMBRE, 
    process.env.BD_USER, 
    process.env.BD_PASS,
    {
        host: process.env.BD_HOST,
        port: process.env.BD_PORT,
        dialect: 'mysql',
        logging: false, // Desactiva el log de consultas SQL

        define: {
            timestamps: true // Permite que Sequelize agregue campos createdAt/updatedAt por defecto
        },

        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 1000
        },
        operatorAliases: false
    }
);

export default db;