// const { connection } = require('./../config/connect');
const UserModel = require('./../model/users.model');

module.exports = {
    getUsers: async (req, res) => {
        try {
            //throw new Error('DB error');
            const rows = await UserModel.getAll();
            res.json(rows);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },
    getUser: async (req, res) => {
        const id = req.params.id;

        try {
            const row = await UserModel.getById({ id });
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

    },
    createUser: async (req, res) => {
        const input = req.body;

        try {
            const row = await UserModel.create({ input });

            if (row.affectedRows === 0) return res.status(404).json({
                message: 'No se logro'
            });

            console.log(row);
            res.send('registro insertado');
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },
    updateUser: async (req, res) => {
        const id = req.params.id;
        const input = req.body;

        try {
            const rows = await UserModel.updateById({ id, input });

            if (rows.affectedRows === 0) return res.status(404).json({
                message: 'No se encontro'
            });

            res.send('cambios realizados');
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id;

        try {
            const row = await UserModel.deleteById({ id });

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