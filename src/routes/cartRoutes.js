const express = require('express');
const { addToCart, getCart, checkout } = require('../controllers/cartController.js');
const authenticateToken = require('../middleware/authenticate.js');

const router = express.Router();

router.post('/add-to-cart', authenticateToken, addToCart);
router.get('/', authenticateToken, getCart);
router.post('/checkout', authenticateToken, checkout);

module.exports = router;
