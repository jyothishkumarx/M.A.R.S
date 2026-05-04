const AuditLog = require("../models/AuditLog");

const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });

        res.json({
            success: true,
            message: "Audit logs fetched successfully",
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs"
        });
    }
};

module.exports = { getAuditLogs };