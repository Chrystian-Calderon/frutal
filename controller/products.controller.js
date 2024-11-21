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
        const id = req.query.id;

        try {
            const rows = await this.productsModel.deleteById({ id });
            res.send('carrito eliminado');
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
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

    getIcecream = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.productsModel.getIcecream({ id });
            res.json(rows);
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    getAddition = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.productsModel.getAddition({ id });
            res.json(rows);
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    createIcecream = async (req, res) => {
        const {name, capacity, type, price} = req.body;

        try {
            const input = {
                name: name,
                typeProduct: 'cream_icecream',
                capacity: capacity,
                type: type,
                price: price
            };
            const row = await this.productsModel.createIcecream({ input });
            res.send("Registro guardado");
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    createAddition = async (req, res) => {
        const {name, unitprice, priceperpack} = req.body;

        try {
            const input = {
                name: name,
                typeProduct: 'addition',
                unitprice: unitprice,
                wholesaleprice: 0.8,
                priceperpack: priceperpack
            };
            const row = await this.productsModel.createAddition({ input });
            res.send("Registro guardado");
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    updateIcecream = async (req, res) => {
        const { id } = req.body.params;
        const input = req.body.data;

        try {
            const rows = await this.productsModel.updateIcecream({ id, input });
            res.send('cambios realizados');
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    updateAddition = async (req, res) => {
        const { id } = req.body.params;
        const input = req.body.data;

        try {
            const rows = await this.productsModel.updateAddition({ id, input });
            res.send('cambios realizados');
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
}

module.exports = ProductsController;