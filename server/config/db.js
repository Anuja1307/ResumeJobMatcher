const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MongoDB URI Error: MONGO_URI environment variable is not defined");
            return;
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        console.error("If on AWS EC2, ensure MongoDB Atlas Network Access includes 0.0.0.0/0 or the EC2 IP.");
    }
};

module.exports = connectDb;