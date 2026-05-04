// ----------------------------------------
// IMPORTS
// ----------------------------------------

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// DB connection
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");
const redactRoutes = require("./routes/redactRoutes");
const auditRoutes = require("./routes/auditRoutes");

// ----------------------------------------
// INITIALIZE APP
// ----------------------------------------

const app = express();

// ----------------------------------------
// DATABASE CONNECTION
// ----------------------------------------

connectDB();

// ----------------------------------------
// GLOBAL MIDDLEWARE
// ----------------------------------------

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // REQUIRED for JWT cookies

// ----------------------------------------
// TEST ROUTES
// ----------------------------------------
const { requireAuth } = require("./middleware/authMiddleware");

app.get("/protected", requireAuth, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed",
        user: req.user
    });
});
app.get("/", (req, res) => {
    res.send("M.A.R.S backend running");
});

// ADD THIS (important for testing auth later)
app.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend working"
    });
});

// ----------------------------------------
// ROUTES
// ----------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/redact", redactRoutes);
app.use("/api/audit", auditRoutes);

// ----------------------------------------
// SERVER START
// ----------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});