// Import required modules
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Import Audit Log model
const AuditLog = require("../models/AuditLog");

// Simple risk analysis function
const analyzeRisk = (metadata) => {
    let riskScore = 0;

    // CATEGORY 1: GPS Data (+40)
    if (metadata.GPSLatitude || metadata.GPSLongitude) {
        riskScore += 40;
    }

    // CATEGORY 2: Author / User Info (+25)
    if (
        metadata.Author ||
        metadata.Creator ||
        metadata.OwnerName ||
        metadata.UserName
    ) {
        riskScore += 25;
    }

    // CATEGORY 3: Device Info (+15)
    if (
        metadata.Make ||
        metadata.Model ||
        metadata.Software ||
        metadata.DeviceManufacturer ||
        metadata.DeviceModel
    ) {
        riskScore += 15;
    }

    // CATEGORY 4: File Path / System Info (+20)
    if (
        metadata.FileName ||
        metadata.Directory ||
        metadata.FilePath
    ) {
        riskScore += 20;
    }

    // Determine severity
    let severity = "Low";
    if (riskScore >= 60) severity = "High";
    else if (riskScore >= 30) severity = "Medium";

    return { riskScore, severity };
};

// MAIN CONTROLLER (IMPORTANT: async added here)
exports.scanFile = async (req, res) => {
    try {
        const filePath = req.file.path;

        // Run ExifTool
        exec(`exiftool -j "${filePath}"`, async (error, stdout) => {

            if (error) {
                return res.status(500).json({
                    message: "Metadata extraction failed",
                    error: error.message
                });
            }

            // Parse metadata
            const metadata = JSON.parse(stdout);
            const cleanMetadata = metadata[0];

            // Analyze risk
            const riskAnalysis = analyzeRisk(cleanMetadata);

            // Create short metadata summary
            const summary = Object.keys(cleanMetadata)
                .slice(0, 5)
                .join(", ");

            // TEMP userId (will replace later)
            const userId = "000000000000000000000000";

            // Save audit log
            await AuditLog.create({
                userId: userId,
                fileName: req.file.originalname,
                actionType: "scan",
                riskScore: riskAnalysis.riskScore,
                severity: riskAnalysis.severity,
                redactionApplied: false,
                metadataSummary: summary
            });

            // Send response
            res.status(200).json({
                message: "File scanned successfully",
                metadata: cleanMetadata,
                riskScore: riskAnalysis.riskScore,
                severity: riskAnalysis.severity
            });

            // Delete uploaded file after processing
            fs.unlinkSync(filePath);
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};