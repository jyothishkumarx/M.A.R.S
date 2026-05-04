const express = require("express");
const router = express.Router();

const { redactFile } = require("../controllers/redactController");
const upload = require("../middleware/uploadMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");

router.post(
    "/",
    requireAuth,
    upload.single("file"),
    redactFile
);

module.exports = router;