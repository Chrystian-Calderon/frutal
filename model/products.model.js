const BaseModel = require('./base.model');

class ProductModel extends BaseModel {
    constructor() {
        super('idProduct', 'products');
    }
}

module.exports = new ProductModel();