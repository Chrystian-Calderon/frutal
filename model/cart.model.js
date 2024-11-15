const BaseModel = require('./base.model');

class CartModel extends BaseModel {
    constructor() {
        super('code', 'cart');
    }

    async getCars() {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = `
            SELECT
                ct.code,
                ct.state,
                p.name
            FROM cart ct
            LEFT JOIN person p ON ct.idPerson = p.idPerson`;
            
            const rows = await conn.query(sql);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getCar({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = `
            SELECT
                ct.code,
                ct.state,
                BIN_TO_UUID(p.idPerson) AS idPerson,
                p.name
            FROM cart ct
            LEFT JOIN person p ON ct.idPerson = p.idPerson
            WHERE ct.code = ?`;
            
            const [rows] = await conn.query(sql, [id]);
            return rows[0];
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async create({ input }) {
        let sql = 'INSERT INTO ' + this._table + ' (';
        let auxSQL = '';
        let values = [];
        for (let key in input) {
            if (key == 'idPerson') {
                auxSQL += 'UUID_TO_BIN(?), ';
            } else {
                auxSQL += '?, ';
            }
            sql += key + ', ';
            values.push(input[key]);
        }
        sql = sql.substring(0, sql.length - 2);
        sql += ') VALUES (' + auxSQL.substring(0, auxSQL.length - 2) + ')';

        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query(sql, values);
    
            return row;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new CartModel();