const express = require('express');

const UserController = require('./../controller/users.controller');

const { checkAuth } = require("../middleware/auth");
const { checkRoleAuth } = require('../middleware/roleAuth');

const createUserController = ({ userModel }) => {
    const router = express.Router();

    const users = new UserController({ userModel });
    
    router.get('/', checkAuth, users.getUsers);
    router.post('/', users.createUser);

    router.get('/userStore', users.getUserStore);
    router.get('/info', users.getUsersInfo);
    router.get('/permissions', users.getPermissions);
    router.post('/getLogin', users.getLogin);
    router.post('/verifyToken', users.verifyTokenR);
    
    //router.put('/users/:id', users.updateUser);
    router.get('/edit', users.getUserForEdit);
    router.get('/:id', users.getUser);
    router.patch('/update', users.updateUser);
    // router.patch('/:id', users.updateUser);
    router.delete('/:id', users.deleteUser);
    
    
    return router;
}

module.exports = createUserController;