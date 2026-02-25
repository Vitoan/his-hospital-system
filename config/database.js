const { Sequelize } = require('sequelize');
require('dotenv').config(); // Asegurarnos de leer el archivo .env

// Instanciamos Sequelize con los datos de nuestro .env
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Ponemos false para que no nos llene la consola de consultas SQL
        timezone: '-03:00' // Ajusta esto a tu zona horaria local (ej. Argentina)
    }
);

module.exports = sequelize;