const express = require('express');

const UserController = require('./../controller/users.controller');

const createUserController = ({ userModel }) => {
    const router = express.Router();

    const users = new UserController({ userModel });
    
    router.get('/', users.getUsers);
    router.post('/', users.createUser);

    router.get('/info', users.getUsersInfo);
    router.post('/getLogin', users.getLogin);
    
    //router.put('/users/:id', users.updateUser);
    router.get('/:id', users.getUser);
    router.patch('/:id', users.updateUser);
    router.delete('/:id', users.deleteUser);
    
    
    return router;
}

module.exports = createUserController;