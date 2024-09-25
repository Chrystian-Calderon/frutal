const BaseModel = require('./base.model');

class PersonModel extends BaseModel {
    constructor() {
        super('idPerson', 'person');
    }

    async getAll() {
        let conn = await BaseModel.getConnection();
        const [rows] = await conn.query('SELECT * FROM ' + this._table);
        const formattedPerson = rows.map(person => {
            return {
                ...person,
                idPerson: person.idPerson.toString('hex')
            };
        });
        return formattedPerson;
    }

    async getPersonData({ input }) {
        let sql = 'SELECT ';
        for (let key in input) {
            sql += key + ', ';
        }
        sql = sql.substring(0, sql.length - 2);
        sql += ' FROM ' + this._table;
        
        const [rows] = await conn.query(sql);
        return rows;
    }

    async create({ input }) {
        let conn = await BaseModel.getConnection();
        const [uuidResult] = await conn.query("SELECT UUID() uuid");
        const [{uuid}] = uuidResult;

        let sql = 'INSERT INTO ' + this._table + ' (' + this._id + ', ';
        let auxSQL = '';
        let values = [];

        for (let key in input) {
            sql += key + ', ';
            auxSQL += '?, ';
            values.push(input[key]);
        }
        sql = sql.substring(0, sql.length - 2);
        sql += ') VALUES (UUID_TO_BIN("' + uuid + '"),' + auxSQL.substring(0, auxSQL.length - 2) + ')';

        const [row] = await conn.query(sql, values);

        return {
            affectedRows: row.affectedRows,
            id: uuid
        };
    }
}

module.exports = new PersonModel();