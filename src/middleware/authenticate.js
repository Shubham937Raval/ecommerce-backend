const jwt = require('jsonwebtoken');
const pool = require('../db');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        if (!user) return res.sendStatus(403);

        req.user = { userId: decoded.id, userEmail: decoded.email, username: decoded.username };
        next();
    } catch (err) {
        res.sendStatus(403);
    }
};

module.exports = authenticateToken;
