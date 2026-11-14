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
    district: {
      type: String,
      default: "",
      trim: true,
    },
    state: {
      type: String,
      default: "Rajasthan",
      trim: true,
    },
    odopProduct: {
      type: String,
      default: "",
      trim: true,
    },
    enterpriseType: {
      type: String,
      default: "ODOP Certified Enterprise",
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: "+91 94600 77112",
      trim: true,
    },
    giTagNumber: {
      type: String,
      default: "GI Tag No. 37",
      trim: true,
    },
    udyamNumber: {
      type: String,
      default: "UDYAM-RJ-20-0012345",
      trim: true,
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

companySchema.pre("save", function (next) {
  const name = (this.name || "").toLowerCase();
  const ind = (this.industry || "").toLowerCase();

  // If empty or accidental legacy default mismatch:
  if (!this.odopProduct || (this.odopProduct === "Kota Doria" && (name.includes("garlic") || ind.includes("garlic") || name.includes("stone") || ind.includes("stone")))) {
    if (name.includes("garlic") || ind.includes("garlic") || ind.includes("lahsun") || ind.includes("agro")) {
      this.odopProduct = "Garlic";
      if (!this.district || this.district === "Kota" || this.district === "Kota, Rajasthan") {
        this.district = "Baran, Rajasthan";
      }
    } else if (name.includes("sand") || ind.includes("sand")) {
      this.odopProduct = "Sandstone";
      if (!this.district || this.district === "Kota" || this.district === "Kota, Rajasthan") {
        this.district = "Bundi, Rajasthan";
      }
    } else if (name.includes("stone") || ind.includes("stone") || ind.includes("limestone")) {
      this.odopProduct = "Kota Stone";
      if (!this.district || this.district === "Kota" || this.district === "Kota, Rajasthan") {
        this.district = "Jhalawar, Rajasthan";
      }
    } else if (name.includes("doria") || ind.includes("doria") || ind.includes("saree") || ind.includes("handloom")) {
      this.odopProduct = "Kota Doria";
      if (!this.district) this.district = "Kota, Rajasthan";
    }
  }

  if (!this.district) {
    if (this.odopProduct === "Garlic") this.district = "Baran, Rajasthan";
    else if (this.odopProduct === "Kota Stone") this.district = "Jhalawar, Rajasthan";
    else if (this.odopProduct === "Sandstone") this.district = "Bundi, Rajasthan";
    else if (this.odopProduct === "Kota Doria") this.district = "Kota, Rajasthan";
  }

  next();
});

module.exports = mongoose.model("Company", companySchema);
