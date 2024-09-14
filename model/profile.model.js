const BaseModel = require('./base.model');

class ProfileModel extends BaseModel {
    constructor() {
        super('id', 'profile');
    }
}

module.exports = new ProfileModel();