const express = require('express');
const morgan = require('morgan');
const path  = require('path');

const createUserController = require('./routes/users.routes');
const UserModel = require('./model/users.model');
const homeRoutes = require('./routes/home.routes');

const app = express();

// configuracion
app.set('port', process.env.PORT_SERVER || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// rutas
//app.use(homeRoutes);
app.use('/users', createUserController({ userModel: UserModel}));

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Que paso'
  });
});

// achivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('server on port ' + app.get('port'));
});