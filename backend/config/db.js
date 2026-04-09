const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        // Connect to MongoDB using URI from .env
        // No extra options needed in modern Mongoose versions
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {

        console.error("MongoDB connection failed:", error.message);

        process.exit(1);
    }
};

module.exports = connectDB;