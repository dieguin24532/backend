import Sequelize from 'sequelize';

const dbTickets = new Sequelize(
    process.env.BD_TICKETS_NOMBRE, 
    process.env.BD_TICKETS_USER, 
    process.env.BD_TICKETS_PASS,
    {
        host: process.env.BD_TICKETS_HOST,
        port: process.env.BD_TICKETS_PORT,
        dialect: 'mysql',
        logging: false,

        define: {
            timestamps: false,
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