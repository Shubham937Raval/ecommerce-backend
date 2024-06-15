const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Function to validate email format using a regex pattern
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        newUser.rows[0].password = undefined;
        newUser.rows[0].token = undefined;
        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    const { userId } = req.user; 
    try {
        await pool.query('UPDATE users SET token = NULL WHERE id = $1', [userId]);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error); // Enhanced logging for debugging
        res.status(500).json({ error: error.message });
    }
};

module.exports = { signup, login, logout };
