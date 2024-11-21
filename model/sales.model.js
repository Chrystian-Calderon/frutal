const BaseModel = require('./base.model');

class SaleModel extends BaseModel {
    constructor() {
        super('idSale', 'sales');
    }

    async getSales({ id }) {
        let conn;
        let query = `
        SELECT
            s.idSale,
            ps.name AS name_user,
            s.date,
            p.name AS name_product,
            p2.name AS addition_product,
            psales.weight AS quantity,
            psales.price AS price,
            pd.name AS distributor_name,
            s.total,
            py.amountPaid
        FROM sales s
        JOIN person ps ON s.idUser = ps.idPerson
        JOIN distributors d ON s.idDistributor = d.idPerson
        JOIN person pd ON d.idPerson = pd.idPerson
        JOIN payments py ON s.idSale = py.idSale
        LEFT JOIN products p ON s.idProduct = p.idProduct
        LEFT JOIN prodsales psales ON s.idSale = psales.idSale
        LEFT JOIN products p2 ON psales.idProduct = p2.idProduct
        WHERE idStore = ?
        ORDER BY s.date DESC`;
        try {
            conn = await BaseModel.getConnection();
            const [rows] = await conn.query(query, [id])
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getById({ id }) {
        let conn;
        let query = `
        SELECT
            s.idSale,
            ps.name AS name_user,
            s.date,
            p.name AS name_product,
            p.idProduct,
            p2.name AS addition_product,
            psales.weight AS quantity,
            psales.price AS price,
            pd.name AS distributor_name,
            BIN_TO_UUID(pd.idPerson) AS idDistributor,
            s.total,
            py.amountPaid
        FROM sales s
        JOIN person ps ON s.idUser = ps.idPerson
        JOIN distributors d ON s.idDistributor = d.idPerson
        JOIN person pd ON d.idPerson = pd.idPerson
        JOIN payments py ON s.idSale = py.idSale
        LEFT JOIN products p ON s.idProduct = p.idProduct
        LEFT JOIN prodsales psales ON s.idSale = psales.idSale
        LEFT JOIN products p2 ON psales.idProduct = p2.idProduct
        WHERE s.idSale = ?
        ORDER BY s.idSale`;
        try {
            conn = await BaseModel.getConnection();
            const [rows] = await conn.query(query, [id]);

            if (rows.length === 0) return null;

            const groupedSales = (rows) => {
                return rows.reduce((acc, current) => {
                    const existingSale = acc.find(sale => sale.idSale === current.idSale);

                    if (existingSale) {
                        if (!existingSale.addition_products) {
                            existingSale.addition_products = [];
                        }
                        existingSale.addition_products.push({
                            name: current.addition_product,
                            quantity: current.quantity,
                            price: current.price
                        });
                    } else {
                        acc.push({
                            idSale: current.idSale,
                            name_user: current.name_user,
                            date: current.date,
                            idProduct: current.idProduct,
                            addition_products: [{
                                name: current.addition_product,
                                quantity: current.quantity,
                                price: current.price
                            }],
                            idDistributor: current.idDistributor,
                            total: current.total,
                            amountPaid: current.amountPaid
                        });
                    }
                    return acc;
                }, []);
              };
              const grouped = groupedSales(rows);

            return grouped;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getSalesReport({ timePeriod }) {
        let conn;
        let sql = `
        SELECT
            s.idSale,
            ps.name AS name_user,
            s.date,
            p.name AS name_product,
            p2.name AS addition_product,
            psales.weight AS quantity,
            psales.price AS price,
            pd.name AS distributor_name,
            s.total,
            py.amountPaid
        FROM sales s
        JOIN person ps ON s.idUser = ps.idPerson
        JOIN distributors d ON s.idDistributor = d.idPerson
        JOIN person pd ON d.idPerson = pd.idPerson
        JOIN payments py ON s.idSale = py.idSale
        LEFT JOIN products p ON s.idProduct = p.idProduct
        LEFT JOIN prodsales psales ON s.idSale = psales.idSale
        LEFT JOIN products p2 ON psales.idProduct = p2.idProduct
        WHERE `;
        try {
            conn = await BaseModel.getConnection();
            let value = '';
            if (timePeriod.hasOwnProperty('DAY')) {
                sql += 'DATE(date) = CURDATE()';
            } else if(timePeriod.hasOwnProperty('MONTH')) {
                sql += 'date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)';
                value = timePeriod.MONTH;
            } else if(timePeriod.hasOwnProperty('YEAR')) {
                sql += 'date >= DATE_SUB(CURDATE(), INTERVAL ? YEAR)';
                value = timePeriod.YEAR;
            }

            sql += 'ORDER BY s.idSale';
            const [rows] = await conn.query(sql, [value]);
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getForStatistics({ timePeriod, id }) {
        let conn;

        try {
            conn = await BaseModel.getConnection();
            let sql = 'SELECT p.paymentDate, p.amountPaid FROM ' + this._table + ' s JOIN payments p ON s.idSale = p.idSale WHERE ';
            let value = '';
            if (timePeriod.hasOwnProperty('DAY')) {
                sql += 'DATE(s.date) BETWEEN DATE_SUB(CURDATE(), INTERVAL ? DAY) AND CURDATE() AND s.idStore = ?';
                value = timePeriod.DAY;
            } else if(timePeriod.hasOwnProperty('MONTH')) {
                sql += 'date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH) AND s.idStore = ?';
                value = timePeriod.MONTH;
            } else if(timePeriod.hasOwnProperty('YEAR')) {
                sql += 'date >= DATE_SUB(CURDATE(), INTERVAL ? YEAR) AND s.idStore = ?';
                value = timePeriod.YEAR;
            }
            const [rows] = await conn.query(sql, [value, id]);

            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async createSale({ input, additions, due }) {
        let conn;
        try {
            let sql = 'INSERT INTO ' + this._table + ' (';
            let auxSQL = '';
            let values = [];
            for (let key in input) {
                if (key == 'idUser' || key == 'idDistributor') {
                    auxSQL += 'UUID_TO_BIN(?), ';
                } else {
                    auxSQL += '?, ';
                }
                values.push(input[key]);
                sql += key + ', ';
            }
    
            sql = sql.substring(0, sql.length - 2);
            sql += ') VALUES (' + auxSQL.substring(0, auxSQL.length - 2) + ')';
    
            conn = await BaseModel.getConnection();
            const [resultSale] = await conn.query(sql, values);

            const validAdditions = additions.filter(addition => 
                addition.quantity && addition.total !== undefined && addition.total !== ""
            );
    
            for (const addition of validAdditions) {
                await conn.query('INSERT INTO prodsales (idProduct, idSale, weight, price) VALUES (?, ?, ?, ?)', [addition.id, resultSale.insertId, addition.quantity, addition.total]);
            }

            const resultPayment = await conn.query('INSERT INTO payments(idSale, amountPaid, paymentDate) VALUES (?, ?, ?)', [resultSale.insertId, due, input['date']]);
            return {
                saleId: resultSale.insertId,
                paymentId: resultPayment.insertId,
                message: "Venta guardado"
            };
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async updateById({ id, input, additions, due }) {
        let conn;
        try {
            let sql = 'UPDATE ' + this._table + ' SET ';
            let values = [];
            for (let key in input) {
                if (key == 'idDistributor') {
                    sql += key + ' = UUID_TO_BIN(?),';
                } else {
                    sql += key + ' = ?,';
                }
                values.push(input[key]);
            }
            sql = sql.substring(0, sql.length - 1);
            sql += ' WHERE ' + this._id + ' = ?';
            values.push(id);
    
            conn = await BaseModel.getConnection();
            const [resultSale] = await conn.query(sql, values);
    
            const validAdditions = additions.filter(addition => 
                addition.quantity && addition.total !== undefined && addition.total !== ""
            );
    
            for (const addition of validAdditions) {
                const [existingProduct] = await conn.query(
                    'SELECT idProduct FROM prodSales WHERE idSale = ? AND idProduct = ?', 
                    [id, addition.id]
                );
            
                if (existingProduct.length > 0) {
                    await conn.query(
                        'UPDATE prodSales SET weight = ?, price = ? WHERE idSale = ? AND idProduct = ?', 
                        [addition.quantity, addition.total, id, addition.id]
                    );
                } else {
                    await conn.query(
                        'INSERT INTO prodSales (idSale, idProduct, weight, price) VALUES (?, ?, ?, ?)', 
                        [id, addition.id, addition.quantity, addition.total]
                    );
                }
            }

            const resultPayment = await conn.query('INSERT INTO payments(idSale, amountPaid, paymentDate) VALUES (?, ?, ?)', [id, due, input['date']]);
            return {
                saleId: id,
                paymentId: resultPayment.insertId,
                message: "Venta actualizado"
            };
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
            const [rowsPayments] = await conn.query('DELETE FROM payments WHERE ' + this._id + ' = ?', [id]);
            const [rowsProdSales] = await conn.query('DELETE FROM prodsales WHERE ' + this._id + ' = ?', [id]);
            const [row] = await conn.query('DELETE FROM ' + this._table + ' WHERE ' + this._id + ' = ?', [id]);

            return row;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new SaleModel();