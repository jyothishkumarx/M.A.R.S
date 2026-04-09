/*
    This function analyzes metadata and calculates:
    - risk score
    - severity
    - detected sensitive fields
*/

exports.analyzeRisk = (metadata) => {

    let riskScore = 0;
    let findings = [];

    // -------- GPS DATA --------
    if (metadata.GPSLatitude || metadata.GPSLongitude) {
        riskScore += 40;
        findings.push("GPS Location Data Detected");
    }

    // -------- AUTHOR INFO --------
    if (metadata.Author || metadata.Creator || metadata.OwnerName) {
        riskScore += 25;
        findings.push("Author/Owner Information Detected");
    }

    // -------- DEVICE INFO --------
    if (metadata.Make || metadata.Model || metadata.Software) {
        riskScore += 15;
        findings.push("Device Information Detected");
    }

    // -------- FILE PATH --------
    if (metadata.Directory || metadata.FilePath) {
        riskScore += 20;
        findings.push("File Path Information Detected");
    }

    // -------- EMAIL REGEX CHECK --------
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/;
    const metadataString = JSON.stringify(metadata);

    if (emailRegex.test(metadataString)) {
        riskScore += 30;
        findings.push("Email Address Detected");
    }

    // -------- SEVERITY --------
    let severity = "Low";

    if (riskScore > 50) {
        severity = "High";
    } else if (riskScore > 20) {
        severity = "Medium";
    }

    return {
        riskScore,
        severity,
        findings
    };
};