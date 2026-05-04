const User = require("../models/User");

const requireRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // Get user from DB
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Check role
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            next();

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    };
};

module.exports = { requireRole };