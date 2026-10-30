require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

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
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(mongoSanitize());

const path = require("path");
app.use("/assets", express.static(path.join(__dirname, "../client/public/assets")));

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
  res.json({
    success: true,
    message: "AI E-Commerce Catalogue Builder API is running smoothly",
    version: "2.5.0",
    environment: process.env.NODE_ENV || "development",
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

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`🚀 Master Catalogue Builder API running on http://localhost:${PORT}`);
});
