class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    getUsers = async (req, res) => {
        try {
            //throw new Error('DB error');
            const rows = await this.userModel.getAll();
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getUser = async (req, res) => {
        const id = req.params.id;

        try {
            const row = await this.userModel.getById({ id });
            console.log(row);
            if (row.length <= 0) return res.status(404).json({
                message: 'Usuario no encontrado'
            });
    
            res.send(row);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }

    }

    createUser = async (req, res) => {
        const input = req.body;

        try {
            const row = await this.userModel.create({ input });

            if (row.affectedRows === 0) return res.status(404).json({
                message: 'No se logro'
            });

            res.send('registro insertado');
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    updateUser = async (req, res) => {
        const id = req.params.id;
        const input = req.body;

        try {
            const rows = await this.userModel.updateById({ id, input });

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

    deleteUser = async (req, res) => {
        const id = req.params.id;

        try {
            const row = await this.userModel.deleteById({ id });

            if (row.affectedRows === 0) return res.status(404).json({
                message: 'No se encontro'
            });

            res.send('algo se elimino');
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = UserController;