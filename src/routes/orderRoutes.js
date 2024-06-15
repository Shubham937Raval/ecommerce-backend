const express = require('express');
const { placeOrder, getOrders } = require('../controllers/orderController.js');
const authenticateToken = require('../middleware/authenticate.js');

const router = express.Router();

router.post('/place-order', authenticateToken, placeOrder);
router.get('/', authenticateToken, getOrders);

module.exports = router;
