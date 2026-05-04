// ----------------------------------------
// IMPORTS
// ----------------------------------------

const { exec } = require("child_process");
const fs = require("fs");
const AuditLog = require("../models/AuditLog");


// ----------------------------------------
// FILTER METADATA (STRICT)
// ----------------------------------------

const filterMetadata = (metadata) => {
    return {
        Location: {
            GPSLatitude: metadata.GPSLatitude || null,
            GPSLongitude: metadata.GPSLongitude || null
        },
        Author: {
            Author: metadata.Author || null,
            Creator: metadata.Creator || null
        },
        Device: {
            Make: metadata.Make || null,
            Model: metadata.Model || null
        },
        System: {
            FileName: metadata.FileName || null,
            Directory: metadata.Directory || null
        }
    };
};


// ----------------------------------------
// RISK ANALYSIS
// ----------------------------------------

const analyzeRisk = (metadata) => {
    let riskScore = 0;

    if (metadata.GPSLatitude || metadata.GPSLongitude) riskScore += 40;
    if (metadata.Author || metadata.Creator) riskScore += 25;
    if (metadata.Make || metadata.Model) riskScore += 15;
    if (metadata.FileName || metadata.Directory) riskScore += 20;

    let severity = "Low";
    if (riskScore >= 60) severity = "High";
    else if (riskScore >= 30) severity = "Medium";

    return { riskScore, severity };
};


// ----------------------------------------
// CONTROLLER
// ----------------------------------------

exports.scanFile = async (req, res) => {
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

        const filePath = req.file.path;
        const userId = req.user.id;

        exec(`exiftool -j "${filePath}"`, async (error, stdout) => {

            try {
                if (error) throw new Error("Metadata extraction failed");

                const rawMetadata = JSON.parse(stdout)[0];

                // FILTERED OUTPUT
                const filteredMetadata = filterMetadata(rawMetadata);

                // RISK ANALYSIS (based on RAW metadata)
                const { riskScore, severity } = analyzeRisk(rawMetadata);

                // SUMMARY (based on filtered keys)
                const summary = Object.keys(filteredMetadata)
                    .join(", ");

                await AuditLog.create({
                    userId,
                    fileName: req.file.originalname,
                    actionType: "scan",
                    riskScore,
                    severity,
                    redactionApplied: false,
                    metadataSummary: summary
                });

                res.json({
                    success: true,
                    message: "File scanned successfully",
                    data: {
                        metadata: filteredMetadata,
                        riskScore,
                        severity
                    }
                });

            } catch (err) {
                res.status(500).json({
                    success: false,
                    message: err.message
                });
            } finally {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
        });

    } catch {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};