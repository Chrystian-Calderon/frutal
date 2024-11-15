const BaseModel = require('./base.model');
const bcrypt = require('bcrypt');

const {SALT_ROUNDS} = require('../config/config');

class UserModel extends BaseModel {
    constructor() {
        super('idPerson', 'users');
    }

    async getAll() {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rows] = await conn.query('SELECT * FROM ' + this._table);
            const formattedUsers = rows.map(user => {
                return {
                    ...user,
                    idPerson: user.idPerson.toString('hex')
                };
            });
            return formattedUsers;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async findById({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('SELECT p.role FROM ' + this._table + ' u JOIN profile p ON u.idProfile = p.id WHERE u.' + this._id + ' = UUID_TO_BIN(?)',
                [id]);
    
            if (row.length === 0) return null;
    
            return row[0];
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async create({ input }) {
        let conn;
        try {
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
            
            conn = await BaseModel.getConnection();
            const [row] = await conn.query(sql, values);
    
            return row;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async updateById({ id, input }) {
        let conn;
        try {
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
    
            conn = await BaseModel.getConnection();
            const [row] = await conn.query(sql, values);
    
            return row;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getUserEdit({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('SELECT u.idPerson, p.name AS name_user, p.lastname, p.cellular, u.email, u.username, u.idProfile, u.idStore FROM users u JOIN person p ON u.idPerson = p.idPerson WHERE u.idPerson = UUID_TO_BIN(?)',
                [id]);
    
            if (row.length === 0) return null;
    
            row[0].idPerson = row[0].idPerson.toString('hex');
            return row[0];
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getLogin({ username, password }) {
        let conn;
        try {
            let result;
    
            conn = await BaseModel.getConnection();
            let sql = `
            SELECT
                u.username,
                BIN_TO_UUID(u.idPerson) as _id,
                u.password,
                us.idStore,
                GROUP_CONCAT(p.name SEPARATOR ', ') AS permissions,
                pr.role
            FROM users u
            JOIN userpermission ON u.idPerson = userpermission.idPerson
            JOIN permissions p ON userpermission.idPermission = p.idPermission
            JOIN profile pr ON u.idProfile = pr.id
            JOIN userstore us ON u.idPerson = us.idPerson`;
            const [rows] = await conn.query(sql + " WHERE username = ? GROUP BY u.username, _id, u.password, us.idStore, pr.role",
                [username]
            );

            if (rows.length === 0) {
                result = {message: 'El usuario no existe'};
            } else {
                if (!bcrypt.compareSync(password, rows[0].password)) {
                    result = {message: 'El usuario o contraseña no son correctos'};
                } else {
                    const idStores = rows.map(item => item.idStore);

                    result = {
                        _id: rows[0]._id,
                        user: rows[0].username,
                        stores: idStores,
                        permissions: rows[0].permissions,
                        role: rows[0].role
                    };
                }
            }

            return [result];
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getDataTwoTables({ table, input1, input2 }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
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
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getDataThreeTables({ table1, table2, input1, input2, input3, join }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
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
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getPermissions({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('SELECT GROUP_CONCAT(p.name SEPARATOR ", ") AS permission, u.idPerson FROM users u LEFT JOIN userpermission up ON u.idPerson = up.idPerson LEFT JOIN permissions p ON up.idPermission = p.idPermission WHERE u.idPerson = UUID_TO_BIN(?) GROUP BY u.idPerson',
                [id]);
    
            if (row.length === 0) return null;
    
            return row[0];
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getUserStore({ id }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [row] = await conn.query('SELECT s.name, u.username FROM users u LEFT JOIN store s ON u.idStore = s.idStore WHERE u.idPerson = UUID_TO_BIN(?)',
                [id]);
    
            if (row.length === 0) return null;
    
            return row[0];
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new UserModel();