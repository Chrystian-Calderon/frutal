const express = require('express');

const DistributorsController = require('./../controller/distributors.controller');

const createDistributorsController = ({ distributorsModel }) => {
    const router = express.Router();

    const distributors = new DistributorsController({ distributorsModel });

    router.get('/name', distributors.getName);

    return router;

}

module.exports = createDistributorsController;