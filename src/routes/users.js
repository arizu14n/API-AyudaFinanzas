const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/registrar', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
