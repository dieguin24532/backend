// Sequelize CLI config for main application DB (CommonJS)
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.BD_USER || 'root',
    password: process.env.BD_PASS || null,
    database: process.env.BD_NOMBRE || 'database_development',
    host: process.env.BD_HOST || '127.0.0.1',
    port: process.env.BD_PORT ? Number(process.env.BD_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.BD_USER || 'root',
    password: process.env.BD_PASS || null,
    database: process.env.BD_NOMBRE || 'database_test',
    host: process.env.BD_HOST || '127.0.0.1',
    port: process.env.BD_PORT ? Number(process.env.BD_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.BD_USER,
    password: process.env.BD_PASS,
    database: process.env.BD_NOMBRE,
    host: process.env.BD_HOST,
    port: process.env.BD_PORT ? Number(process.env.BD_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  }
};
