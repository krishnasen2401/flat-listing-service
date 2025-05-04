const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD + Search
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/', userController.getUsers); // supports search/filter via query params

module.exports = router;
