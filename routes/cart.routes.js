const express = require('express');

const CartController = require('../controller/cart.controller');

const createCartController = ({ cartModel }) => {
    const router = express.Router();

    const cart = new CartController({ cartModel });

    return router;
}

module.exports = createCartController;