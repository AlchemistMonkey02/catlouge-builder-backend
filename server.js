require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { tenantContext } = require("./middleware/authMiddleware");

// Routes
const productRoutes = require("./routes/productRoutes");
const catalogueProductRoutes = require("./routes/catalogueProductRoutes");
// AI Routes commented out - AI features disabled
// const aiRoutes = require("./routes/aiRoutes");
const bulkImportRoutes = require("./routes/bulkImportRoutes");
const imageStudioRoutes = require("./routes/imageStudioRoutes");
const exportRoutes = require("./routes/exportRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const orgRoutes = require("./routes/orgRoutes");
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const catalogueRecordRoutes = require("./routes/catalogueRecordRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// --- Security & utility middleware ---
app.use(helmet({ contentSecurityPolicy: false }));

// Fully permissive CORS with credentials support for any localhost port and live domain
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.options("*", cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(mongoSanitize());

const path = require("path");
const fs = require("fs");
const localAssets = path.join(__dirname, "public/assets");
const clientAssets = path.join(__dirname, "../client/public/assets");
if (fs.existsSync(localAssets)) {
  app.use("/assets", express.static(localAssets));
} else if (fs.existsSync(clientAssets)) {
  app.use("/assets", express.static(clientAssets));
}

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Generous rate limit for SaaS studio operations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please slow down.",
  },
});
app.use("/api", apiLimiter);

// --- API Root Health Check ---
app.get("/", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.json({
    success: true,
    message: "AI E-Commerce Catalogue Builder API is running smoothly",
    database: dbConnected ? "connected" : "disconnected",
    version: "2.5.0",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState] || "unknown";
  res.json({
    success: mongoose.connection.readyState === 1,
    status: mongoose.connection.readyState === 1 ? "healthy" : "degraded",
    database: dbState,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes (unprotected by tenantContext)
app.use("/api/auth", authRoutes);

// Apply Tenant Context to all core SaaS endpoints
app.use("/api/catalogue-products", tenantContext, catalogueProductRoutes);
// app.use("/api/ai", tenantContext, aiRoutes); // AI routes disabled
app.use("/api/bulk", tenantContext, bulkImportRoutes);
app.use("/api/images", tenantContext, imageStudioRoutes);
app.use("/api/export", tenantContext, exportRoutes);
app.use("/api/analytics", tenantContext, analyticsRoutes);
app.use("/api/org", tenantContext, orgRoutes);
app.use("/api/companies", tenantContext, companyRoutes);
app.use("/api/catalogue-records", tenantContext, catalogueRecordRoutes);

// Legacy storefront catalog route (backward compatibility)
app.use("/api/products", productRoutes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5012;

app.listen(PORT, () => {
  console.log(`🚀 Master Catalogue Builder API running on port ${PORT}`);
});
