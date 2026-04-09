const multer = require("multer");
const path = require("path");

// Configure storage location and file naming
const storage = multer.diskStorage({

    // Set destination folder
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // temporary folder
    },

    // Set file name
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }

});

// File filter (only allow images and PDFs)
const fileFilter = (req, file, cb) => {

    const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, and PDF files are allowed"), false);
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

module.exports = upload;