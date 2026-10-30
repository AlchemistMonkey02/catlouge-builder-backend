const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    businessProfile: {
      legalName: { type: String, default: "" },
      gstNumber: { type: String, default: "" },
      supportEmail: { type: String, default: "" },
      supportPhone: { type: String, default: "" },
      address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "India" },
      },
      websiteUrl: { type: String, default: "" },
      brandColors: {
        primary: { type: String, default: "#6366f1" },
        secondary: { type: String, default: "#0f172a" },
        accent: { type: String, default: "#10b981" },
      },
      logoUrl: { type: String, default: "" },
      tone: {
        type: String,
        enum: [
          "professional",
          "premium",
          "minimal",
          "seo_focused",
          "feature_focused",
          "conversion_focused",
          "marketplace_compliant",
          "brand_specific",
        ],
        default: "professional",
      },
      defaultPolicies: {
        warranty: { type: String, default: "1 Year Manufacturer Warranty against defects" },
        care: { type: String, default: "Keep away from water and direct heat. Clean with a soft dry cloth." },
        returnPolicy: { type: String, default: "7 Days Hassle-Free Replacement/Return" },
        shippingInfo: { type: String, default: "Ships within 24-48 business hours via insured courier" },
      },
    },
    quotas: {
      maxProducts: { type: Number, default: 10000 },
      aiTokensUsed: { type: Number, default: 0 },
      aiTokensMonthlyLimit: { type: Number, default: 500000 },
      imageExportsLimit: { type: Number, default: 2000 },
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["owner", "catalog_manager", "editor", "reviewer", "viewer"],
          default: "editor",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", organizationSchema);
