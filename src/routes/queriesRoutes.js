// src/routes/queriesRoutes.js
const express = require('express');
const {
    getSecondHighestOrderValue,
    getMonthlyOrdersAnalysis,
    getUserOrderingSummary
} = require('../controllers/queriesController.js');
const authenticateToken = require('../middleware/authenticate.js');

const router = express.Router();

router.get('/second-highest-order', authenticateToken, getSecondHighestOrderValue);
router.get('/monthly-orders-analysis', authenticateToken, getMonthlyOrdersAnalysis);
router.get('/user-ordering-summary', authenticateToken, getUserOrderingSummary);

module.exports = router;
