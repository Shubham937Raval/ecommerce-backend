// src/controllers/queriesController.js
const pool = require('../db');

// Query to find the second highest order value
const getSecondHighestOrderValue = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT MAX(total) AS second_highest_order_value
            FROM orders
            WHERE total < (SELECT MAX(total) FROM orders)
        `);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Query for monthly orders analysis for the year 2023
const getMonthlyOrdersAnalysis = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                TO_CHAR(created_at, 'Month') AS month,
                COUNT(*) AS total_orders,
                SUM(total) AS total_revenue
            FROM orders
            WHERE EXTRACT(YEAR FROM created_at) = 2023
            GROUP BY TO_CHAR(created_at, 'Month')
            ORDER BY TO_DATE(TO_CHAR(created_at, 'Month'), 'Month')
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Query for user-wise ordering summary
const getUserOrderingSummary = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                u.username,
                COUNT(o.id) AS total_orders,
                SUM(o.total) AS total_value,
                SUM(oi.quantity) AS total_products
            FROM users u
            JOIN orders o ON u.id = o.user_id
            JOIN order_items oi ON o.id = oi.order_id
            GROUP BY u.username
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSecondHighestOrderValue,
    getMonthlyOrdersAnalysis,
    getUserOrderingSummary
};
