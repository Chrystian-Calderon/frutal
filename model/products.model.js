const BaseModel = require('./base.model');

class ProductModel extends BaseModel {
    constructor() {
        super('idProduct', 'products');
    }

    async getAll() {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rows] = await conn.query('SELECT * FROM ' + this._table);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
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
            console.error('Error en la consulta:', e.message);
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
            console.error('Error en la consulta:', e.message);
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

    async getIcecream({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = `
            SELECT
                p.name,
                i.capacity,
                i.type,
                i.price
            FROM products p
            LEFT JOIN icecrems i ON p.idProduct = i.idProduct
            WHERE p.idProduct = ?`;
            
            const [rows] = await conn.query(sql, [id]);
            return rows[0];
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getAddition({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            let sql = `
            SELECT
                p.name,
                a.unitprice,
                a.priceperpack
            FROM products p
            LEFT JOIN additions a ON p.idProduct = a.idProduct
            WHERE p.idProduct = ?`;
            
            const [rows] = await conn.query(sql, [id]);
            return rows[0];
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async createIcecream({ input }) {
        let sqlP = 'INSERT INTO ' + this._table + ' (name, typeProduct) VALUES (?, ?)';
        let sqlI = 'INSERT INTO icecrems (idProduct, capacity, type, price) VALUES (?, ?, ?, ?)';

        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rowP] = await conn.query(sqlP, [input.name, input.typeProduct]);
            const [rowI] = await conn.query(sqlI, [rowP.insertId, input.capacity, input.type, input.price]);
    
            return rowI;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async createAddition({ input }) {
        let sqlP = 'INSERT INTO ' + this._table + ' (name, typeProduct) VALUES (?, ?)';
        let sqlI = 'INSERT INTO additions (idProduct, unitprice, wholesaleprice, priceperpack) VALUES (?, ?, ?, ?)';

        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rowP] = await conn.query(sqlP, [input.name, input.typeProduct]);
            const [rowI] = await conn.query(sqlI, [rowP.insertId, input.unitprice, input.wholesaleprice, input.priceperpack]);
    
            return rowI;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async updateIcecream({ id, input }) {
        let sqlP = 'UPDATE ' + this._table + ' SET name = ? WHERE idProduct = ?';
        let sqlI = 'UPDATE icecrems SET capacity = ?, type = ?, price = ? WHERE idProduct = ?';

        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rowP] = await conn.query(sqlP, [input.name, id]);
            const [rowI] = await conn.query(sqlI, [input.capacity, input.type, input.price, id]);
    
            return rowI;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async updateAddition({ id, input }) {
        let sqlP = 'UPDATE ' + this._table + ' SET name = ? WHERE idProduct = ?';
        let sqlI = 'UPDATE icecrems SET unitprice = ?, wholesaleprice = ?, priceperpack = ? WHERE idProduct = ?';

        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rowP] = await conn.query(sqlP, [input.name, id]);
            const [rowI] = await conn.query(sqlI, [input.unitprice, input.wholesaleprice, input.priceperpack, id]);
    
            return rowI;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async deleteById({ id }) {
        let sqlA = 'DELETE FROM additions WHERE idProduct = ?';
        let sqlI = 'DELETE FROM icecrems WHERE idProduct = ?';
        let sqlP = 'DELETE FROM ' + this._table + ' WHERE idProduct = ?';
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rowA] = await conn.query(sqlA, [id]);
            const [rowI] = await conn.query(sqlI, [id]);
            const [rowP] = await conn.query(sqlP, [id]);
    
            return rowP;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new ProductModel();