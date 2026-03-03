// Sequelize CLI config for WordPress DB (CommonJS)
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.WP_DB_USER || process.env.BD_USER || 'root',
    password: process.env.WP_DB_PASS || process.env.BD_PASS || null,
    database: process.env.WP_DB_NAME || process.env.BD_NOMBRE || 'wordpress',
    host: process.env.WP_DB_HOST || process.env.BD_HOST || '127.0.0.1',
    port: process.env.WP_DB_PORT ? Number(process.env.WP_DB_PORT) : (process.env.BD_PORT ? Number(process.env.BD_PORT) : 3306),
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.WP_DB_USER || 'root',
    password: process.env.WP_DB_PASS || null,
    database: process.env.WP_DB_NAME || 'wordpress_test',
    host: process.env.WP_DB_HOST || '127.0.0.1',
    port: process.env.WP_DB_PORT ? Number(process.env.WP_DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  },
  production: {
    username: process.env.WP_DB_USER,
    password: process.env.WP_DB_PASS,
    database: process.env.WP_DB_NAME,
    host: process.env.WP_DB_HOST,
    port: process.env.WP_DB_PORT ? Number(process.env.WP_DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false
  }
};
