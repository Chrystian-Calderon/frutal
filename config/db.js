// config/db.js
require('dotenv').config(); // Cargar variables de entorno desde .env
const mysql = require('mysql');

// Crear la conexión a la base de datos usando variables de entorno
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3307 // Usar puerto 3306 por defecto si no está definido
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = connection;
