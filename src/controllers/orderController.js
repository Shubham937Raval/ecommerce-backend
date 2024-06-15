const pool = require('../db');

const placeOrder = async (req, res) => {
    const { userId } = req.user;
    const { totalAmount, paymentMethod } = req.body;
    try {
        const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
        if (cartItems.rows.length === 0) return res.status(400).json({ error: 'No items in cart' });

        const newOrder = await pool.query(
            'INSERT INTO orders (user_id, total, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [userId, totalAmount]
        );

        for (const item of cartItems.rows) {
            const product = await pool.query('SELECT price FROM products WHERE id = $1', [item.product_id]);
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [newOrder.rows[0].id, item.product_id, item.quantity, product.rows[0].price]
            );
        }

        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.json(newOrder.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getOrders = async (req, res) => {
    const { userId } = req.user;
    try {
        const orders = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        res.json(orders.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { placeOrder, getOrders };
