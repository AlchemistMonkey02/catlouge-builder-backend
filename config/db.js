const mongoose = require("mongoose");
const dns = require("dns");

// Set reliable DNS resolvers for Windows MongoDB Atlas SRV lookup
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e.message);
}

/**
 * Connects to MongoDB using the connection string in process.env.MONGODB_URI or MONGO_URI.
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("No MongoDB connection URI found in environment variables");
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB connection warning: ${error.message}`);
    console.log("Server will keep running and retry in background.");
  }
};

module.exports = connectDB;
