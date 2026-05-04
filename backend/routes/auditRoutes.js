const express = require("express");
const router = express.Router();

const { getAuditLogs } = require("../controllers/auditController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Only Admin and Auditor can access audit logs
router.get("/", requireAuth, requireRole("admin", "auditor"), getAuditLogs);

module.exports = router;