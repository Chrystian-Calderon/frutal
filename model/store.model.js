const BaseModel = require('./base.model');

class StoreModel extends BaseModel {
    constructor() {
        super('idStore', 'store');
    }

    async getWithParams({ params }) {
        let conn = await BaseModel.getConnection();
        let sql = 'SELECT ';
        params.forEach(key => {
            sql += key + ', ';
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ' FROM ' + this._table;

        const rows = await conn.query(sql);
        return rows;
    }
}

module.exports = new StoreModel();      