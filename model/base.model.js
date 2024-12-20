const { connection } = require('./../config/connect');

class BaseModel {
    constructor(id, table) {
        this._id = id;
        this._table = table;
    }

    static async getConnection() {
        try {
            const conn = await connection.getConnection();
            return conn;
        } catch (err) {
            console.error('Error al obtener la conexión:', err.message);
            throw err;
        }
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

    async getById({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('SELECT * FROM ' + this._table + ' WHERE ' + this._id + ' = ?',
                [id]);
    
            if (row.length === 0) return null;
            
            return row[0];
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
            sql += key + ', ';
            auxSQL += '?, ';
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

    async updateById({ id, input }) {
        let sql = 'UPDATE ' + this._table + ' SET ';
        let values = [];
        for (let key in input) {
            sql += key + ' = ?,';
            values.push(input[key]);
        }
        sql = sql.substring(0, sql.length - 1);
        sql += ' WHERE ' + this._id + ' = ?';
        values.push(id);
        console.log(sql)
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

    async deleteById({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('DELETE FROM ' + this._table + ' WHERE ' + this._id + ' = ?',
                [id]);
    
            return row;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = BaseModel;