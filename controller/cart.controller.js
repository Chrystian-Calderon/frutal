class CartController {
    constructor({ cartModel }) {
        this.cartModel = cartModel;
    }

    getCars = async (req, res) => {
        try {
            const [rows] = await this.cartModel.getCars();
            res.json(rows);
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    getCar = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.cartModel.getCar({ id });
            res.json(rows);
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    createCar = async (req, res) => {
        const {code, state, idPerson} = req.body;

        try {
            const input = {
                code: code,
                state: state,
                idPerson: idPerson ?? null
            };
            const row = await this.cartModel.create({ input });
            res.send("Registro guardado");
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    updateCar = async (req, res) => {
        const { id } = req.body.params;
        const input = req.body.data;
        try {
            const rows = await this.cartModel.updateById({ id, input });
            res.send('cambios realizados');
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }

    deleteCar = async (req, res) => {
        const id = req.query.id;
        try {
            const rows = await this.cartModel.deleteById({ id });
            res.send('carrito eliminado');
        } catch (e) {
            res.status(500).json({
                error: e.message
            });
        }
    }
}

module.exports = CartController;