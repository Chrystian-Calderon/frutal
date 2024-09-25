const express = require('express');

const DistributorsController = require('./../controller/distributors.controller');

const createDistributorsController = ({ distributorsModel }) => {
    const router = express.Router();

    const distributors = new DistributorsController({ distributorsModel });

    return router;

}

module.exports = createDistributorsController;