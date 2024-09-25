const BaseModel = require('./base.model');
const bcrypt = require('bcrypt');

const {SALT_ROUNDS} = require('../config/config');

class UserModel extends BaseModel {
    constructor() {
        super('idPerson', 'users');
    }

    async getAll() {
        let conn = await BaseModel.getConnection();
        const [rows] = await conn.query('SELECT * FROM ' + this._table);
        const formattedUsers = rows.map(user => {
            return {
                ...user,
                idPerson: user.idPerson.toString('hex')
            };
        });
        return formattedUsers;
    }

    async create({ input }) {
        let sql = 'INSERT INTO ' + this._table + ' (';
        let auxSQL = '';
        let values = [];
        for (let key in input) {
            sql += key + ', ';
            auxSQL += '?, ';
            if (key === 'password') {
                let hashedPassword = bcrypt.hashSync(input[key], SALT_ROUNDS);
                values.push(hashedPassword);
            } else {
                if (key !== 'idPerson') {
                    values.push(input[key]);
                }
            }
        }
        sql = sql.substring(0, sql.length - 2);
        sql += ') VALUES (UUID_TO_BIN("' + input.idPerson + '"), ' + auxSQL.substring(0, auxSQL.length - 5) + ')';
        console.log(sql)
        let conn = await BaseModel.getConnection();
        const [row] = await conn.query(sql, values);

        return row;
    }

    async updateById({ id, input }) {
        let sql = 'UPDATE ' + this._table + ' SET ';
        let values = [];
        for (let key in input) {
            sql += key + ' = ?,';
            if (key === 'password') {
                let hashedPassword = await bcrypt.hash(input[key], SALT_ROUNDS);
                values.push(hashedPassword);
            } else {
                values.push(input[key]);
            }
        }
        sql = sql.substring(0, sql.length - 1);
        sql += ' WHERE ' + this._id + ' = ?';
        values.push(Buffer.from(id, 'hex'));

        let conn = await BaseModel.getConnection();
        const [row] = await conn.query(sql, values);

        return row;
    }

    async getLogin({ username, password }) {
        let result;

        let conn = await BaseModel.getConnection();
        const [rows] = await conn.query('SELECT * FROM ' + this._table + ' WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            result = {message: 'El usuario no existe'};
        } else {
            if (!bcrypt.compare.compareSync(password, rows[0].password)) {
                result = {message: 'El usuario o contraseña no son correctos'};
            } else {
                const [store] = await conn.query('SELECT name FROM store WHERE idStore = ?',
                    [rows[0]['idStore']]);
    
                result = {
                    user: rows[0].username,
                    store: store[0].name
                };
            }
        }
        
        return [result];
    }

    async getDataTwoTables({ table, input1, input2 }) {
        let conn = await BaseModel.getConnection();
        let sql = 'SELECT ';
        input1.forEach(key => {
            sql += this._table + '.' + key + ', ';
        });
        input2.forEach(key => {
            sql += table + '.' + key + ', ';
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ' FROM ' + this._table + ' JOIN ' + table + ' ON ' + this._table + '.' + this._id + '=' + table + '.' + this._id;

        const [rows] = await conn.query(sql);

        const formattedUsers = rows.map(user => {
            return {
                ...user,
                idPerson: user.idPerson.toString('hex')
            };
        });
        return formattedUsers;
    }

    async getDataThreeTables({ table1, table2, input1, input2, input3, join }) {
        let conn = await BaseModel.getConnection();
        let sql = 'SELECT ';
        input1.forEach(key => {
            sql += this._table + '.' + key + ', ';
        });
        input2.forEach(key => {
            sql += table1 + '.' + key + ', ';
        });
        input3.forEach(key => {
            sql += table2 + '.' + key + ', ';
        });
        sql = sql.substring(0, sql.length - 2);
        sql += ' FROM ' + this._table + ' LEFT JOIN ' + table1 + ' ON ' + this._table + '.' + this._id + '=' + table1 + '.' + this._id + ' LEFT JOIN ' + table2 + ' ON ' + this._table + '.' + join + '=' + table2 + '.' + join;

        const [rows] = await conn.query(sql);

        const formattedUsers = rows.map(user => {
            return {
                ...user,
                idPerson: user.idPerson.toString('hex')
            };
        });
        return formattedUsers;
    }
}

module.exports = new UserModel();