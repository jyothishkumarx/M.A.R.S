const express = require("express");
const router = express.Router();

const { scanFile } = require("../controllers/scanController");
const upload = require("../middleware/uploadMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

// Route: Scan File
router.post(
    "/",
    requireAuth,          // 1. Check login
    upload.single("file"), // 2. Handle file upload
    scanFile              // 3. Run scan logic
);

module.exports = router;