const express = require('express');
const { signup, login, logout } = require('../controllers/userController.js');
const authenticateToken = require('../middleware/authenticate.js');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

module.exports = router;
