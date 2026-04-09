const express = require("express");
const router = express.Router();

const AuditLog = require("../models/AuditLog");

router.get("/", async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching logs",
            error: error.message
        });
    }
});

module.exports = router;