require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3307
});

connection.connect((err) => {
  if (err) {
    console.error('Error en la conexion', err);
    return;
  }
  console.log('Conexión a la base de datos');
});

module.exports = connection;
