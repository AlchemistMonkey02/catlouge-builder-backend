const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      default: "Premium Product Collection",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
    },
    brandColors: {
      primary: { type: String, default: "#6366f1" },
      secondary: { type: String, default: "#0f172a" },
      accent: { type: String, default: "#10b981" },
    },
    contact: {
      email: { type: String, default: "contact@company.com" },
      phone: { type: String, default: "+91 98765 43210" },
      website: { type: String, default: "https://www.company.com" },
      address: { type: String, default: "Corporate Business Park, Sector 44, Gurugram, India" },
    },
    qrLinks: {
      businessProfile: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      website: { type: String, default: "" },
      location: { type: String, default: "" },
      instagram: { type: String, default: "" },
      custom: { type: String, default: "" },
      customLabel: { type: String, default: "Scan to Order" },
    },
    legal: {
      gstNumber: { type: String, default: "07AAAAA0000A1Z5" },
      taxId: { type: String, default: "PAN-ABCDE1234F" },
      currency: { type: String, default: "INR" },
    },
    wholesaleTerms: {
      type: String,
      default: "Minimum Order Quantity (MOQ): 10 units per SKU. Net 30 payment terms available for verified trade partners. Prices exclusive of applicable GST.",
    },
    industry: {
      type: String,
      default: "General",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ organizationId: 1, name: 1 });

module.exports = mongoose.model("Company", companySchema);
