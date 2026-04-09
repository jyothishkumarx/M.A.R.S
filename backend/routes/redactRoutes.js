const express = require("express");
const router = express.Router();

const { redactFile } = require("../controllers/redactController");
const upload = require("../middleware/uploadMiddleware");

// Redaction route
router.post("/", upload.single("file"), redactFile);

module.exports = router;