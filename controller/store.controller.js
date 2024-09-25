class StoreController {
    constructor({ storeModel }) {
        this.storeModel = storeModel;
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
}

module.exports = StoreController;