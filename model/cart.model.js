const BaseModel = require('./base.model');

class CartModel extends BaseModel {
    constructor() {
        super('code', 'cart');
    }
}

module.exports = new CartModel();