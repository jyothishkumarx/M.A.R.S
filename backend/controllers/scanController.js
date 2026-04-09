const { exec } = require("child_process"); // Child process module to run ExifTool command
const fs = require("fs"); // File system module for deleting uploaded files
const { analyzeRisk } = require("../utils/riskAnalyzer"); // Import risk analysis function
/*
    @desc    Scan file and extract metadata
    @route   POST /api/scan
    @access  Private (we'll secure later)
*/
exports.scanFile = async (req, res) => {

    try {

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;

        // Execute ExifTool command
        exec(`exiftool -j "${filePath}"`, (error, stdout, stderr) => {

            if (error) {
                return res.status(500).json({ message: "ExifTool error", error: stderr });
            }

            // Parse metadata JSON
            const metadata = JSON.parse(stdout);

            // Delete file after processing (important)
            fs.unlinkSync(filePath);

            const cleanMetadata = metadata[0];

// Analyze risk
            const riskAnalysis = analyzeRisk(cleanMetadata);

            res.status(200).json({
                message: "Metadata analyzed successfully",
                metadata: cleanMetadata,
                risk: riskAnalysis
});

        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};