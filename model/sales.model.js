const BaseModel = require('./base.model');

class SaleModel extends BaseModel {
    constructor() {
        super('idSale', 'sales');
    }

    async getForStatistics() {
        let conn = await BaseModel.getConnection();
        const [rows] = await conn.query('SELECT DATE(date) AS date, total, paid, due, idStore FROM ' + this._table);
        rows.forEach((row) => {
            const date = new Date(row['date']);
            const formattedDate = date.toISOString().split('T')[0];
            row['date'] = formattedDate;
        });
        return rows;
    }
}

module.exports = new SaleModel();