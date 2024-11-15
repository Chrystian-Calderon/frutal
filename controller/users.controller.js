const personModel = require("../model/person.model");
const {validateUser, validatePassword} = require("../helpers/Validation");
const {validateUserError, validatePasswordError} = require("../helpers/errors");
const { tokenSign, verifyToken } = require("../helpers/generateToken");

class UserController {
    constructor({ userModel }) {
        this.userModel = userModel;
    }

    getUsers = async (req, res) => {
        console.log("Solicitud recibida en /users/info");
        try {
            const rows = await this.userModel.getAll();
            console.log("Datos obtenidos:", rows);
            res.status(200).json(rows);

        } catch (error) {
            console.error("Error en getUsers:", error.message);
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getUser = async (req, res) => {
        const id = req.params.id;

        try {
            const row = await this.userModel.getById({ id });

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

    getPermissions = async (req, res) => {
        const id = req.query.id;
        console.log(id)
        try {
            const row = await this.userModel.getPermissions({ id });

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

    getUserStore = async (req, res) => {
        const id = req.query.id;

        try {
            const row = await this.userModel.getUserStore({ id });

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
        const {name, lastname, cellular, username, password, email, profile, store} = req.body;
        try {
            let input = {
                name: name,
                lastname: lastname,
                cellular: cellular
            };
            const rowPerson = await personModel.create({ input });
            if (rowPerson.affectedRows === 0) return res.status(404).json({
                message: 'No se logro'
            });
            
            input = {
                idPerson: rowPerson.id,
                username: username,
                password: password,
                email: (email) ? email : null,
                idProfile: profile,
                idStore: (store) ? store : null
            }
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
        const { id } = req.body.params;
        const input = req.body.data;

        try {
            // const rows = await this.userModel.updateById({ id, input });

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

    getUsersInfo = async (req, res) => {
        console.log("Solicitud recibida en /users/info");
        try {
            const table1 = 'person';
            const table2 = 'store';
            const input1 = ['username', 'email', 'idPerson'];
            const input2 = ['cellular'];
            const input3 = ['name'];
            const join = 'idStore';
            const rowsPerson = await this.userModel.getDataThreeTables({ table1, table2, input1, input2, input3, join });
            console.log(rowsPerson);
            res.json(rowsPerson);
        } catch (error) {
            console.error("Error en getUsersInfo:", error.message);
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getUserForEdit = async (req, res) => {
        const id = req.query.id;
        console.log(id)
        try {
            const row = await this.userModel.getUserEdit({ id });

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

    getLogin = async (req, res, next) => {
        const {username, password} = req.body;

        try {
            validateUser(username);
            validatePassword(password);

            const [rows] = await this.userModel.getLogin({ username, password });
            const token = await tokenSign(rows);

            if (rows.message !== undefined) {
                return res.status(404).json({
                    result: false,
                    message: rows.message
                });
            }
            
            res.status(200).json({
                result: true,
                token: token
            });
        } catch (error) {
            if (error instanceof validateUserError) {
                return res.status(400).json({error: error.message});
            }
            if (error instanceof validatePasswordError) {
                return res.status(400).json({error: error.message});
            }

            next(error);
        }
    }

    verifyTokenR = async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
  
        if (!token) return res.status(401).json({ message: 'No valido', ok: false });

        if (!verifyToken(token)) return res.status(401).json({ message: 'Token no valido', ok: false });

        res.status(200).json({ message: 'Token valido', ok: true });
    }
}

module.exports = UserController;