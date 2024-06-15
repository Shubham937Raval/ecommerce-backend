const express = require('express');
const { addProduct, getProducts } = require('../controllers/productController.js');
const authenticateToken = require('../middleware/authenticate.js');

const router = express.Router();

router.post('/', authenticateToken, addProduct);
router.get('/', getProducts);

module.exports = router;
