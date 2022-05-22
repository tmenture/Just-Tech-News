// Imports sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// Creates connection to our database passing my mysql info to login
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });

module.exports = sequelize;