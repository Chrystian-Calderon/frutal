const BaseModel = require('./base.model');

class StoreModel extends BaseModel {
    constructor() {
        super('idStore', 'store');
    }
}

module.exports = new StoreModel();