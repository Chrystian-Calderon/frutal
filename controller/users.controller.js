const personModel = require("../model/person.model");
const Validation = require("../model/Validation");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config/config');

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

    getUsersInfo = async (req, res) => {
        try {
            const table1 = 'person';
            const table2 = 'store';
            const input1 = ['username', 'email', 'idPerson'];
            const input2 = ['cellular'];
            const input3 = ['name'];
            const join = 'idStore';
            const rowsPerson = await this.userModel.getDataThreeTables({ table1, table2, input1, input2, input3, join });

            res.json(rowsPerson);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    getLogin = async (req, res) => {
        const {username, password} = req.body;

        Validation.username(username);
        Validation.password(password);
        
        try {
            const [rows] = await this.userModel.getLogin({ username, password });
            const token = jwt.sign(
                {id: rows[0].idPerson, },
                SECRET_KEY,
                {
                    expiresIn: '1h'
                });
            if (rows.message !== undefined) {
                return res.status(404).json({
                    result: false,
                    message: rows.message
                });
            }
            
            res.status(200).json({
                result: true,
                data: rows
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
}

module.exports = UserController;