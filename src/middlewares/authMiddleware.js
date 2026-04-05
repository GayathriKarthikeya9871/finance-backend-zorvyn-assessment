const db = require('../config/database');

const authenticate = (req, res, next) => {
    const username = req.headers['x-user-id'];

    if (!username) {
        return res.status(401).json({ error: "Missing x-user-id header" });
    }

    db.get(`SELECT * FROM users WHERE username = ? AND status = 'active'`, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "User not found or inactive" });
        }

        req.user = user;
        next();
    });
};

const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    };
};

module.exports = { authenticate, requireRole };