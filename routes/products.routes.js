const express = require('express');

const ProductsController = require('./../controller/products.controller');

const createProductsController = ({ productsModel }) => {
    const router = express.Router();

    const products = new ProductsController({ productsModel });

    router.get('/name', products.getName);
    router.get('/additions', products.getAdditions);

    router.get('/', products.getProducts);
    router.post('/', products.createProduct);

    router.get('/:id', products.getProduct);
    router.patch('/:id', products.updateProduct);
    router.delete('/:id', products.deleteProduct);
    
    return router;
}

module.exports = createProductsController;