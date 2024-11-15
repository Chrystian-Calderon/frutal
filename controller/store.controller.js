class StoreController {
    constructor({ storeModel }) {
        this.storeModel = storeModel;
    }

    getStoreById = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.storeModel.getById({ id });

            res.json(rows);
        } catch (error) {
            console.log(error)
            res.status(500).json({
                error: error.message
            });
        }
    }

    getStoresName = async (req, res) => {
        try {
            let params = ['idStore', 'name'];
            const [rows] = await this.storeModel.getWithParams({ params });
            res.json(rows);
        } catch (error) {
            res.status(500).json({
                error: error.message
            });
        }
    }

    getStoresSales = async (req, res) => {
        try {
            const { month } = req.query.month;

            if (!month) {
                return res.status(400).json({ error: 'Debe proporcionar un mes' });
            }

            const rows = await this.storeModel.getSalesAll({ month });

            res.status(200).json(rows);
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getStoreSales = async (req, res) => {
        const currentDate = new Date();
        const day = currentDate.toISOString().split('T')[0];
        try {
            const { month, id } = req.query;
            if (!id) return res.status(400).json({error: 'No se enuentra la tienda'});
            if (!month) return res.status(400).json({ error: 'Debe proporcionar un mes' });

            const row = await this.storeModel.getSalesById({ month, day, id });

            res.status(200).json(row);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getStoresSalesMonthDay = async (req, res) => {
        try {
            const currentDate = new Date();
            const day = currentDate.toLocaleDateString('en-CA');
            const { month } = req.query.month;

            if (!month) {
                return res.status(400).json({ error: 'Debe proporcionar un mes' });
            }

            const rows = await this.storeModel.getSalesMonthDay({ month, day });

            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getStoreSalesTotals = async (req, res) => {
        try {
            const { month } = req.query.month;

            if (!month) {
                return res.status(400).json({ error: 'Debe proporcionar un mes' });
            }

            const rows = await this.storeModel.getStoreSalesTotals({ month });

            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getSalesProducts = async (req, res) => {
        try {
            const { month } = req.query.month;

            if (!month) {
                return res.status(400).json({ error: 'Debe proporcionar un mes' });
            }

            const rows = await this.storeModel.getSalesProducts({ month });

            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getComparationSales = async (req, res) => {
        try {
            const { month } = req.query.month;

            if (!month) {
                return res.status(400).json({ error: 'Debe proporcionar un mes' });
            }

            const rows = await this.storeModel.getComparationSales({ month });

            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    updateStore = async (req, res) => {
        const { id } = req.body.params;
        const data = req.body.data;

        try {
            const input = {
                name: data.storeName,
                telephone: data.contact,
                address: data.address
            };
            const rows = await this.storeModel.updateById({ id, input });

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
}

module.exports = StoreController;