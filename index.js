const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path  = require('path');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./helpers/errors');
const createUserController = require('./routes/users.routes');
const createProfileController = require('./routes/profile.routes');
const createSalesController = require('./routes/sales.routes');
const createStoreController = require('./routes/store.routes');
const createProductsController = require('./routes/products.routes');
const createDistributorsController = require('./routes/distributors.routes');
const createCartController = require('./routes/cart.routes');
const UserModel = require('./model/users.model');
const SaleModel = require('./model/sales.model');
const ProfileModel = require('./model/profile.model');
const StoreModel = require('./model/store.model');
const ProductsModel = require('./model/products.model');
const DistributorsModel = require('./model/distributors.model');
const CartModel = require('./model/cart.model');

const app = express();

// configuracion
app.set('port', process.env.PORT_SERVER || 3000);
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Demasiadas solicitudes, por favor intenta más tarde.'
});

// middlewares
app.use(limiter);
const corsUrl = process.env.NODE_ENV == 'production' ? [process.env.FRONTEND_URL, 'https://heladosfrutal.com', 'https://www.heladosfrutal.com'] : ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:5173'];
app.use(cors({
  origin: corsUrl,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(errorHandler);

// rutas
app.use('/users', createUserController({ userModel: UserModel }));
app.use('/profile', createProfileController({ profileModel: ProfileModel }));
app.use('/store', createStoreController({ storeModel: StoreModel }));
app.use('/sales', createSalesController({ saleModel: SaleModel }));
app.use('/products', createProductsController({ productsModel: ProductsModel }));
app.use('/distributors', createDistributorsController({ distributorsModel: DistributorsModel }));
app.use('/cart', createCartController({ cartModel: CartModel }));

app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found request'
  });
});

// achivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('server on port ' + app.get('port'));
});