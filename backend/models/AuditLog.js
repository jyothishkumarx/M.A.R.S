const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({

    // User who performed action
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // File name
    fileName: {
        type: String,
        required: true
    },

    // Action type: scan or redact
    actionType: {
        type: String,
        enum: ["scan", "redact"],
        required: true
    },

    // Risk score
    riskScore: {
        type: Number,
        default: 0
    },

    // Severity level
    severity: {
        type: String,
        default: "Low"
    },

    // Whether redaction was applied
    redactionApplied: {
        type: Boolean,
        default: false
    },

    // Short metadata summary (string)
    metadataSummary: {
        type: String
    },

    // Timestamp
    timestamp: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("AuditLog", AuditLogSchema);