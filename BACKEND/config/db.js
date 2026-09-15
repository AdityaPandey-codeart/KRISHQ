const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    console.log("MONGO_URI exists:", !!uri);

    if (!uri) {
        console.error("MONGO_URI is not loaded from .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB Connected Successfully 🌱");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;