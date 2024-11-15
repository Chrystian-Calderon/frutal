const BaseModel = require('./base.model');
const cartModel = require('./cart.model');

class DistributorModel extends BaseModel {
    constructor() {
        super('idPerson', 'distributors');
    }

    async getName() {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = 'SELECT p.name, BIN_TO_UUID(p.idPerson) AS id FROM distributors d JOIN person p ON d.idPerson = p.idPerson';
            
            const rows = await conn.query(sql);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new DistributorModel();