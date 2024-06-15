const pool = require('../db');

const addProduct = async (req, res) => {
    const { name, description, price } = req.body;
    try {
        const newProduct = await pool.query(
            'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
        );
        res.json(newProduct.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await pool.query('SELECT * FROM products');
        res.json(products.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addProduct, getProducts };
