const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    // Full name of user
    name: {
        type: String,
        required: true
    },

    // Email (used for login)
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Hashed password (bcrypt output)
    passwordHash: {
        type: String,
        required: true
    },

    // Role-based access
    role: {
        type: String,
        enum: ["admin", "user", "auditor"], // restrict values
        default: "user"
    },

    // Timestamp
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", UserSchema);