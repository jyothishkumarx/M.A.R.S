// Import required modules
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Import Audit Log model
const AuditLog = require("../models/AuditLog");

// MAIN CONTROLLER
exports.redactFile = async (req, res) => {
    try {
        // Input file path (uploaded file)
        const inputPath = req.file.path;

        // Output file path (cleaned file)
        const outputPath = path.join(
            path.dirname(inputPath),
            "cleaned_" + req.file.originalname
        );

        // Run ExifTool to remove ALL metadata
        exec(
            `exiftool -all= "${inputPath}" -o "${outputPath}"`,
            async (error) => {

                if (error) {
                    return res.status(500).json({
                        message: "Metadata redaction failed",
                        error: error.message
                    });
                }

                // TEMP userId (will be replaced later with JWT user)
                const userId = "000000000000000000000000";

                // Save audit log for redaction
                await AuditLog.create({
                    userId: userId,
                    fileName: req.file.originalname,
                    actionType: "redact",
                    riskScore: 0,
                    severity: "Low",
                    redactionApplied: true,
                    metadataSummary: "All metadata removed"
                });

                // Send cleaned file to client
                res.download(outputPath, "cleaned_" + req.file.originalname, (err) => {

                    // Cleanup files after sending
                    try {
                        fs.unlinkSync(inputPath);   // delete original upload
                        fs.unlinkSync(outputPath);  // delete cleaned file
                    } catch (cleanupError) {
                        console.error("File cleanup error:", cleanupError.message);
                    }

                    if (err) {
                        console.error("Download error:", err.message);
                    }
                });
            }
        );

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};