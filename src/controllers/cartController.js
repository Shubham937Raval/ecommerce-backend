const pool = require('../db');

const addToCart = async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    try {
        const newCartItem = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [userId, productId, quantity]
        );
        res.json(newCartItem.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCart = async (req, res) => {
    const { userId } = req.user;
    try {
        const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
        res.json(cartItems.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkout = async (req, res) => {
    const { userId } = req.user;
    const { cartId, paymentMethod } = req.body;
    try {
        const cartItems = await pool.query('SELECT * FROM cart WHERE id = $1 AND user_id = $2', [cartId, userId]);
        if (cartItems.rows.length === 0) return res.status(400).json({ error: 'Cart not found' });

        let totalAmount = 0;
        for (const item of cartItems.rows) {
            const product = await pool.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
            totalAmount += product.rows[0].price * item.quantity;
        }

        const newOrder = await pool.query(
            'INSERT INTO orders (user_id, total, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [userId, totalAmount]
        );

        for (const item of cartItems.rows) {
            await pool.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [newOrder.rows[0].id, item.product_id, item.quantity, (await pool.query('SELECT price FROM products WHERE id = $1', [item.product_id])).rows[0].price]
            );
        }

        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);

        res.json(newOrder.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addToCart, getCart, checkout };
