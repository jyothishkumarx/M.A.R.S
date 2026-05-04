// ----------------------------------------
// IMPORTS
// ----------------------------------------

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const AuditLog = require("../models/AuditLog");


// ----------------------------------------
// CONTROLLER
// ----------------------------------------

exports.redactFile = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const originalPath = req.file.path;
        const ext = path.extname(originalPath);
        const cleanedPath = originalPath.replace(ext, `_cleaned${ext}`);
        const userId = req.user.id;

        // CREATE CLEAN FILE (ORIGINAL UNTOUCHED)
        exec(`exiftool -all= -o "${cleanedPath}" "${originalPath}"`, async (error) => {

            try {
                if (error) throw new Error("Redaction failed");

                await AuditLog.create({
                    userId,
                    fileName: req.file.originalname,
                    actionType: "redact",
                    riskScore: 0,
                    severity: "Low",
                    redactionApplied: true,
                    metadataSummary: "All metadata removed"
                });

                // SEND CLEAN FILE
                res.download(cleanedPath, req.file.originalname, (err) => {

                    // DELETE BOTH FILES
                    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
                    if (fs.existsSync(cleanedPath)) fs.unlinkSync(cleanedPath);

                    if (err) console.error(err);
                });

            } catch (err) {

                if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
                if (fs.existsSync(cleanedPath)) fs.unlinkSync(cleanedPath);

                res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
        });

    } catch {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};