// Import mongoose to define schema and models
const mongoose = require("mongoose");


// Define structure of the User document
// This tells MongoDB what fields each user must have
const UserSchema = new mongoose.Schema({

    // Username for login
    username: {

        type: String,     // Data type is text
        required: true,   // Field must be provided
        unique: true      // No duplicate usernames allowed

    },

    // Email address of the user
    email: {

        type: String,
        required: true,
        unique: true

    },

    // Password will store bcrypt hashed password
    password: {

        type: String,
        required: true

    },

    // Role determines permissions
    // Example: admin or analyst
    role: {

        type: String,
        default: "analyst"

    },

    // Automatically store account creation time
    createdAt: {

        type: Date,
        default: Date.now

    }

});


// Export model so it can be used by authentication logic
module.exports = mongoose.model("User", UserSchema);