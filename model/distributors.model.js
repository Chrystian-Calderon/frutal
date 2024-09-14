const BaseModel = require('./base.model');
const cartModel = require('./cart.model');

class DistributorModel extends BaseModel {
    constructor() {
        super('idPerson', 'distributors');
    }
}

module.exports = new DistributorModel();