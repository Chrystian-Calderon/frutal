const express = require('express');
const morgan = require('morgan');
const path  = require('path');
//const authRoutes = require('./routes/auth');
//const dashboardRoutes = require('./routes/dashboard');
const app = express();

// configuracion
app.set('port', process.env.PORT || 3000);
// middlewares
app.use(morgan('dev'));
app.use(express.json());
// rutas

// achivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('server on port ' + app.get('port'));
});

/*const PORT = 5000;

//app.use(express.json());
app.use('/', authRoutes);
app.use('/', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});*/