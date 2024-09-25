const express = require('express');

const ProductsController = require('./../controller/products.controller');

const createProductsController = ({ productsModel }) => {
    const router = express.Router();

    const products = new ProductsController({ productsModel });
    
    return router;
}

module.exports = createProductsController;