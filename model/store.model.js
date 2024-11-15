const BaseModel = require('./base.model');

class StoreModel extends BaseModel {
    constructor() {
        super('idStore', 'store');
    }

    async getSalesAll({ month }) {
        let conn;
        try {
            conn = await BaseModel.getConnection();
            const [rows] = await conn.query("SELECT COALESCE(SUM(sales.total), 0) AS sales, store.name FROM store LEFT JOIN sales ON store.idStore = sales.idStore AND MONTH(sales.date) = ? GROUP BY store.name",
                [month]
            );
    
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getSalesById({ month, day, id }) {
        let conn;
        try {
            const query = `
            SELECT
                store.idStore,
                store.name,
                SUM(CASE WHEN DATE(sales.date) = ? THEN sales.total ELSE 0 END) AS sales_day,
                SUM(CASE WHEN MONTH(sales.date) = ? AND YEAR(sales.date) = ? THEN sales.total ELSE 0 END) AS sales_month
            FROM
                store
            LEFT JOIN sales ON store.idStore = sales.idStore
                AND MONTH(sales.date) = ?
                AND YEAR(sales.date) = ?
            GROUP BY store.name, store.idStore
            WHERE store.idStore = ?
            `;
            conn = await BaseModel.getConnection();
            const year = "2024";
            const [rows] = await conn.query(query, [day, month, year, month, year, id]);
    
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getSalesMonthDay({ month, day }) {
        let conn;
        try {
            const query = `
            SELECT
                store.idStore,
                store.name,
                SUM(CASE WHEN DATE(sales.date) = ? THEN sales.total ELSE 0 END) AS sales_day,
                SUM(CASE WHEN MONTH(sales.date) = ? AND YEAR(sales.date) = ? THEN sales.total ELSE 0 END) AS sales_month
            FROM
                store
            LEFT JOIN sales ON store.idStore = sales.idStore
                AND MONTH(sales.date) = ?
                AND YEAR(sales.date) = ?
            GROUP BY store.name, store.idStore`;
            conn = await BaseModel.getConnection();
            const year = "2024";
            const [rows] = await conn.query(query, [day, month, year, month, year]);
    
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getStoreSalesTotals({ month }) {
        let conn;
        try {
            const query = `
            SELECT
                store.idStore,
                store.name,
                SUM(CASE WHEN MONTH(sales.date) = ? AND YEAR(sales.date) = ? THEN sales.total ELSE 0 END) AS sales_month
            FROM
                store
            LEFT JOIN sales ON store.idStore = sales.idStore
                AND MONTH(sales.date) = ?
                AND YEAR(sales.date) = ?
            GROUP BY store.name, store.idStore`;
            conn = await BaseModel.getConnection();
            const year = new Date().getFullYear();

            const [rows] = await conn.query(query, [month, year, month, year]);
    
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getSalesProducts({ month }) {
        let conn;
        try {
            const query = `
            SELECT 
                st.idStore,
                st.name AS storeName,
                IFNULL(SUM(CASE 
                    WHEN p.typeProduct != 'addition' THEN pay.amountPaid
                    ELSE 0 
                END), 0) AS totalIcecream,
                IFNULL(COUNT(CASE 
                    WHEN p.typeProduct != 'addition' THEN 1
                    ELSE NULL
                END), 0) AS cantidadIcecream,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Barquillo' THEN ps.price
                    ELSE 0 
                END), 0) AS totalBarquillo,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Cono' THEN ps.price
                    ELSE 0 
                END), 0) AS totalCono,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Canasta' THEN ps.price
                    ELSE 0 
                END), 0) AS totalCanasta,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Estrella' THEN ps.price
                    ELSE 0 
                END), 0) AS totalEstrella,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Barquillo' THEN ps.weight
                    ELSE 0
                END), 0) AS cantidadBarquillo,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Cono' THEN ps.weight
                    ELSE 0
                END), 0) AS cantidadCono,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Canasta' THEN ps.weight
                    ELSE 0
                END), 0) AS cantidadCanasta,
                IFNULL(SUM(CASE 
                    WHEN ap.typeProduct = 'addition' AND ap.name = 'Estrella' THEN ps.weight
                    ELSE 0
                END), 0) AS cantidadEstrella
            FROM store st
            LEFT JOIN sales s ON st.idStore = s.idStore
            LEFT JOIN payments pay ON s.idSale = pay.idSale
            LEFT JOIN products p ON s.idProduct = p.idProduct
            LEFT JOIN prodsales ps ON s.idSale = ps.idSale
            LEFT JOIN products ap ON ps.idProduct = ap.idProduct
            WHERE
                (s.date IS NULL OR DATE_FORMAT(s.date, '%Y-%m') = ?)
            GROUP BY 
                st.idStore, st.name`;
            conn = await BaseModel.getConnection();
            const year = new Date().getFullYear();

            const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;
            const [rows] = await conn.query(query, [formattedDate]);
    
            return rows;
        } catch (e) {
            console.error('Error en la consulta:', e.message);
        } finally {
            if (conn) conn.release();
        }
    }

    async getComparationSales({ month }) {
        let conn
        try {
            const query = `
            SELECT 
                st.idStore,
                st.name AS storeName,
                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND p.typeProduct != 'addition' THEN pay.amountPaid
                    ELSE 0
                END), 0) AS totalIcecreamOne,
                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND p.typeProduct != 'addition' THEN pay.amountPaid
                    ELSE 0
                END), 0) AS totalIcecreamTwo,
                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND p.typeProduct != 'addition' THEN pay.amountPaid
                    ELSE 0
                END), 0) AS totalIcecreamThree,

                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND ap.typeProduct = 'addition' THEN ps.price
                    ELSE 0
                END), 0) AS totalAdditionOne,
                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND ap.typeProduct = 'addition' THEN ps.price
                    ELSE 0
                END), 0) AS totalAdditionTwo,
                IFNULL(SUM(CASE 
                    WHEN DATE_FORMAT(s.date, '%Y-%m') = ? AND ap.typeProduct = 'addition' THEN ps.price
                    ELSE 0
                END), 0) AS totalAdditionThree
            FROM store st
            LEFT JOIN sales s ON st.idStore = s.idStore
            LEFT JOIN payments pay ON s.idSale = pay.idSale
            LEFT JOIN products p ON s.idProduct = p.idProduct
            LEFT JOIN prodsales ps ON s.idSale = ps.idSale
            LEFT JOIN products ap ON ps.idProduct = ap.idProduct
            WHERE 
                (s.date IS NULL OR DATE_FORMAT(s.date, '%Y-%m') IN (?, ?, ?))
            GROUP BY 
                st.idStore, st.name`;
            conn = await BaseModel.getConnection();
            const year = new Date().getFullYear();
    
            const formattedDateOne = `${year}-${month.toString().padStart(2, '0')}`;
            month = month - 1;
            const formattedDateTwo = `${year}-${month.toString().padStart(2, '0')}`;
            month = month - 1;
            const formattedDateThree = `${year}-${month.toString().padStart(2, '0')}`;
            const [rows] = await conn.query(query, [formattedDateOne, formattedDateTwo, formattedDateThree, formattedDateOne, formattedDateTwo, formattedDateThree, formattedDateOne, formattedDateTwo, formattedDateThree]);

            const formatData = rows.map(item => {
                const totalone = item.totalIcecreamOne + item.totalAdditionOne;
                const totaltwo = item.totalIcecreamTwo + item.totalAdditionTwo;
                const totalthree = item.totalIcecreamThree + item.totalAdditionThree;

                return {
                    idStore: item.idStore,
                    storeName: item.storeName,
                    totalOne: totalone,
                    totalTwo: totaltwo,
                    totalThree: totalthree
                };
            });
            return formatData;
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
            console.error('Error en la consulta:', error.message);
        } finally {
            if (conn) conn.release();
        }
    }

}

module.exports = new StoreModel();      