class SalesController {
    constructor({ saleModel }) {
        this.saleModel = saleModel;
    }

    getSales = async (req, res) => {
        try {
            //throw new Error('DB error');
            const rows = await this.saleModel.getAll();
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getForStatistics = async (req, res) => {
        try {
            const rows = await this.saleModel.getForStatistics();
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
}

module.exports = SalesController;