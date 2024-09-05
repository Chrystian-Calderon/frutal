const express = require('express');
const morgan = require('morgan');
const path  = require('path');

const { connection } = require('./config/connect');
//const authRoutes = require('./routes/auth');
//const dashboardRoutes = require('./routes/dashboard');
const app = express();

// configuracion
app.set('port', process.env.PORT_SERVER || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// rutas
app.get('/employees', (req, res) => {
  res.send('obteniendo empleados');
});
app.post('/employees', (req, res) => {
  res.send('creando empleados');
});
app.put('/employees', (req, res) => {
  res.send('actualizando emppleados');
});
app.delete('/employees', (req, res) => {
  res.send('eliminando empleado');
});

// achivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('server on port ' + app.get('port'));
});