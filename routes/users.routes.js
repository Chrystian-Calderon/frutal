const express = require('express');

const users = require('./../controller/users.controller');

const router = express.Router();

router.get('/users', users.getUsers);
router.get('/users/:id', users.getUser);
router.post('/users', users.createUser);
//router.put('/users/:id', users.updateUser);
router.patch('/users/:id', users.updateUser);
router.delete('/users/:id', users.deleteUser);

module.exports = router;