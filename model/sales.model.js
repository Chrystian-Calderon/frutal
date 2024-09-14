const BaseModel = require('./base.model');

class SaleModel extends BaseModel {
    constructor() {
        super('idSale', 'sales');
    }
}

module.exports = new SaleModel();