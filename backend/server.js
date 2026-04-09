// Import express framework
// Express handles HTTP requests and responses
const express = require("express");

// Import security middleware
// Helmet sets secure HTTP headers
const helmet = require("helmet");

// Allows frontend to communicate with backend
const cors = require("cors");

// Loads environment variables from .env file
require("dotenv").config();

// Import database connection function
const connectDB = require("./config/db");

// Initialize Express application
const app = express();


// ----------------------------------------
// DATABASE CONNECTION
// ----------------------------------------

// Call the function that connects to MongoDB
connectDB();


// ----------------------------------------
// GLOBAL MIDDLEWARE
// ----------------------------------------

// Apply security headers to all requests
app.use(helmet());

// Allow cross-origin requests from frontend
app.use(cors());

// Allow server to parse JSON request bodies
// Example: login form submissions
app.use(express.json());


// ----------------------------------------
// BASIC TEST ROUTE
// ----------------------------------------

// Simple test route to confirm server is working
app.get("/", (req, res) => {

    res.send("M.A.R.S backend running");

});


// ----------------------------------------
// SERVER START
// ----------------------------------------

// Port number from environment variable
// Defaults to 5000 if not provided
const PORT = process.env.PORT || 5000;

// Start listening for incoming requests
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});