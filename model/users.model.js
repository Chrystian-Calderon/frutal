const BaseModel = require('./base.model');

class UserModel extends BaseModel {
    constructor() {
        super('idPerson', 'users');
    }
}

module.exports = new UserModel();