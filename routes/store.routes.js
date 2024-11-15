const express = require('express');

const StoreController = require('./../controller/store.controller');

const createStoreController = ({ storeModel }) => {
    const router = express.Router();

    const store = new StoreController({ storeModel });

    router.patch('/update', store.updateStore);

    router.get('/data', store.getStoreById);
    router.get('/storeSales', store.getStoresSales);
    router.get('/storeSale', store.getStoreSales);
    router.get('/storeSalesMonthDay', store.getStoresSalesMonthDay);
    router.get('/name', store.getStoresName);
    router.get('/storeSalesTotals', store.getStoreSalesTotals);
    router.get('/storeSalesProducts', store.getSalesProducts);
    router.get('/storeComparationSales', store.getComparationSales);

    return router;
}

module.exports = createStoreController;