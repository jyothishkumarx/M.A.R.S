const express = require("express");
const router = express.Router();

const { scanFile } = require("../controllers/scanController");
const upload = require("../middleware/uploadMiddleware");

// Route for file scanning
router.post("/", upload.single("file"), scanFile);

module.exports = router;