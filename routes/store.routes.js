const express = require('express');

const StoreController = require('./../controller/store.controller');

const createStoreController = ({ storeModel }) => {
    const router = express.Router();

    const store = new StoreController({ storeModel });

    router.get('/list', store.getStoresName);

    return router;
}

module.exports = createStoreController;