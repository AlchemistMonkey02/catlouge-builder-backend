const mongoose = require("mongoose");
const dns = require("dns");

// Custom DNS fallback only on Windows platform where Node.js SRV lookup occasionally fails
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
  }
}

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 */
let isConnecting = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }
  isConnecting = true;

  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("No MongoDB connection URI found in environment variables (MONGODB_URI / MONGO_URI)");
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas connected successfully: ${conn.connection.host}`);
    isConnecting = false;
  } catch (error) {
    isConnecting = false;
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log("👉 Tip: Verify that the server's public IP address is whitelisted in MongoDB Atlas (Network Access -> 0.0.0.0/0).");
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB connection disconnected. Attempting to reconnect...");
  setTimeout(connectDB, 5000);
});

mongoose.connection.on("error", (err) => {
  console.error("⚠️ MongoDB connection error event:", err.message);
});

module.exports = connectDB;
