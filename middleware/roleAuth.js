const {verifyToken} = require("../helpers/generateToken");
const usersModel = require("../model/users.model");

const checkRoleAuth = (roles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await verifyToken(token);
        const id = tokenData._id;
        const userData = await usersModel.findById({ id });

        if ([].concat(roles).includes(userData.role)) {
            next();
        } else {
            res.status(409);
            res.send({error: "No tienes permisos"});
        }
    } catch (e) {
        console.log(e);
        res.status(409);
        res.send({error: 'No tienes permisos'});
    }
}

module.exports = {checkRoleAuth};