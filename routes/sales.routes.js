const express = require('express');

const SalesController = require('./../controller/sales.controller');

const createSalesController = ({ saleModel }) => {
    const router = express.Router();

    const sales = new SalesController({ saleModel });
    
    router.get('/', sales.getSales);
    router.post('/', sales.createSale);

    router.get('/edit', sales.getSaleForEdit);
    router.patch('/update', sales.updateSale);
    router.delete('/delete', sales.deleteSale);

    router.get('/report', sales.getSalesReport);
    router.get('/statistics', sales.getForStatistics);

    return router;
}

module.exports = createSalesController;