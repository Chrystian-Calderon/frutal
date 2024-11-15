const express = require('express');

const CartController = require('../controller/cart.controller');

const createCartController = ({ cartModel }) => {
    const router = express.Router();

    const cart = new CartController({ cartModel });

    router.get('/', cart.getCars);
    router.get('/car', cart.getCar);
    router.post('/', cart.createCar);
    router.patch('/update', cart.updateCar);
    router.delete('/delete', cart.deleteCar);

    return router;
}

module.exports = createCartController;