const express = require('express');

const UserController = require('./../controller/users.controller');

const createUserController = ({ userModel }) => {
    const router = express.Router();

    const users = new UserController({ userModel });
    
    router.get('/', users.getUsers);
    router.get('/:id', users.getUser);
    router.post('/', users.createUser);
    //router.put('/users/:id', users.updateUser);
    router.patch('/:id', users.updateUser);
    router.delete('/:id', users.deleteUser);

    return router;
}

module.exports = createUserController;