class ProductsController {
    constructor({ productsModel }) {
        this.productsModel = productsModel;
    }

    getProducts = async (req, res) => {
        try {
            const rows = await this.productsModel.getAll();
            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    createProduct = async (req, res) => {

    }

    getProduct = async (req, res) => {

    }

    updateProduct = async (req, res) => {

    }

    deleteProduct = async (req, res) => {

    }

    getName = async(req, res) => {
        try {
            const [rows] = await this.productsModel.getIceCream();
            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }

    getAdditions = async (req, res) => {
        try {
            const [rows] = await this.productsModel.getAdditions();
            res.json(rows);
        } catch (e) {
            return res.status(500).json({
                error: e.message
            });
        }
    }
}

module.exports = ProductsController;