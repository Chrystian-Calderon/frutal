const BaseModel = require('./base.model');

class PersonModel extends BaseModel {
    constructor() {
        super('idPerson', 'person');
    }
}

module.exports = new PersonModel();