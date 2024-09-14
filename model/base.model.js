const { connection } = require('./../config/connect');

class BaseModel {
    constructor(id, table) {
        this._id = id;
        this._table = table;
    }

    static async getConnection() {
        try {
            return await connection.getConnection();
        } catch (err) {
            console.error('Error al obtener la conexión:', err.message);
            throw err;
        }
    }

    async getAll() {
        let conn = await BaseModel.getConnection();
        const [rows] = await conn.query('SELECT * FROM ' + this._table);
        return rows;
    }

    async getById({ id }) {
        let conn = await BaseModel.getConnection();
        const [row] = await conn.query('SELECT * FROM ' + this._table + ' WHERE ' + this._id + ' = ?',
            [id]);

        if (row.length === 0) return null;

        return row[0];
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

        let conn = await BaseModel.getConnection();
        const [row] = await conn.query(sql, values);

        return row;
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

        let conn = await BaseModel.getConnection();
        const [row] = await conn.query(sql, values);

        return row;
    }

    async deleteById({ id }) {
        let conn = await BaseModel.getConnection();
        const [row] = await conn.query('DELETE FROM ' + this._table + ' WHERE ' + this._id + ' = ?',
            [id]);

        return row;
    }
}

module.exports = BaseModel;