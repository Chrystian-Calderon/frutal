class SalesController {
    constructor({ saleModel }) {
        this.saleModel = saleModel;
    }

    getSales = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.saleModel.getSales({ id });
            console.log(rows)
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getSalesReport = async (req, res) => {
        let { timePeriod, store, month } = req.query;

        let period;
        if (timePeriod) {
            switch (timePeriod) {
                case '1D':
                    period = {DAY: 1};
                    break;
                case '5D':
                    period = {DAY: 5};
                    break;
                case '1M':
                    period = {MONTH: 1};
                    break;
                case '6M':
                    period = {MONTH: 6};
                    break;
                case '1A':
                    period = {YEAR: 1};
                    break;
                default:
                    return res.status(400).json({ error: 'Periodo de tiempo inválido' });
            }
        } else if (month) {
            period = { MONTH: parseInt(month) };
        }

        try {
            timePeriod = period;
            const rows = await this.saleModel.getSalesReport({timePeriod: period, store});

            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getForStatistics = async (req, res) => {
        let { timePeriod, id } = req.query;
        id = parseInt(id);
        if (!timePeriod) {
            return res.status(400).json({ error: 'Periodo de tiempo requerido' });
        }
    
        let period;
        switch (timePeriod) {
            case '1d':
                period = {DAY: 1};
                break;
            case '5d':
                period = {DAY: 5};
                break;
            case '1m':
                period = {MONTH: 1};
                break;
            case '6m':
                period = {MONTH: 6};
                break;
            case '1a':
                period = {YEAR: 1};
                break;
            default:
                return res.status(400).json({ error: 'Periodo de tiempo inválido' });
        }

        try {
            timePeriod = period;
            const rows = await this.saleModel.getForStatistics({ timePeriod, id });
            res.status(200).json(rows);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getSaleForEdit = async (req, res) => {
        const id = req.query.id;
        try {
            const row = await this.saleModel.getById({ id });

            if (row.length <= 0) return res.status(404).json({
                message: 'venta no encontrado'
            });
    
            res.send(row[0]);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
    }

    createSale = async (req, res) => {
        const {date, due, total, product, distributor, idUser, idStore, additions} = req.body;
        
        try {
            const input = {
                date: date,
                total: total,
                idProduct: product,
                idDistributor: distributor,
                idUser: idUser,
                idStore: idStore
            };
            const row = await this.saleModel.createSale({ input, additions, due });
            res.send("Registro guardado");
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    updateSale = async (req, res) => {
        const { id } = req.body.params;
        const data = req.body.data;

        const input = {
            date: data.date,
            idProduct: data.product,
            idDistributor: data.distributor,
            total: data.total
        };
        const additions = data.additions;
        const due = data.due;
        try {
            const rows = await this.saleModel.updateById({ id, input, additions, due });

            if (rows.affectedRows === 0) return res.status(404).json({
                message: 'No se encontro'
            });

            res.send('cambios realizados');
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    deleteSale = async (req, res) => {
        const id = req.query.id;

        try {
            const row = await this.saleModel.deleteById({ id });

            if (row.affectedRows === 0) return res.status(404).json({
                message: 'No se encontro'
            });

            res.status(200).json({
                ok: true,
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = SalesController;