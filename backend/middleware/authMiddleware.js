const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    try {
        // 1. Get token from cookie
        const token = req.cookies.token;

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user to request
        req.user = {
            id: decoded.id
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

module.exports = {
    requireAuth
};