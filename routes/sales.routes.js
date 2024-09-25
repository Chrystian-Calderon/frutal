const express = require('express');

const UserController = require('./../controller/sales.controller');
const SalesController = require('./../controller/sales.controller');

const createSalesController = ({ saleModel }) => {
    const router = express.Router();

    const sales = new SalesController({ saleModel });
    
    router.get('/', sales.getSales);

    router.get('/statistics', sales.getForStatistics);

    return router;
}

module.exports = createSalesController;