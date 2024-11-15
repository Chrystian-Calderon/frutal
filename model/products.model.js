const BaseModel = require('./base.model');

class ProductModel extends BaseModel {
    constructor() {
        super('idProduct', 'products');
    }

    async getWithParams({ params }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = 'SELECT ';
            params.forEach(key => {
                sql += key + ', ';
            });
            sql = sql.substring(0, sql.length - 2);
            sql += ' FROM ' + this._table;
    
            const rows = await conn.query(sql);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getAdditions() {
        let conn;
        const query = `
        SELECT
            p.idProduct,
            p.name,
            a.unitprice
        FROM products p
        JOIN additions a ON p.idProduct=a.idProduct`;
        try {
            conn = await BaseModel.getConnection();

            const rows = await conn.query(query);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getIceCream() {
        let conn;
        const query = `
        SELECT
            p.idProduct,
            p.name,
            i.price
        FROM products p
        JOIN icecrems i ON p.idProduct=i.idProduct`;
        try {
            conn = await BaseModel.getConnection();

            const rows = await conn.query(query);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ProductModel();