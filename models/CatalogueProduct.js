const mongoose = require("mongoose");

const catalogueProductSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    // Core Identification & SKU
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      index: true,
    },
    parentSku: {
      type: String,
      trim: true,
      default: "",
    },
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        sku: { type: String, required: true },
        title: { type: String, default: "" },
        color: { type: String, default: "" },
        size: { type: String, default: "" },
        style: { type: String, default: "" },
        price: { type: Number, default: 0 },
        mrp: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
        barcode: { type: String, default: "" },
        image: { type: String, default: "" },
      },
    ],
    // Product Details
    name: {
      type: String,
      required: [true, "Product title/name is required"],
      trim: true,
      maxlength: [500, "Title cannot exceed 500 characters"],
      index: "text",
    },
    aiTitleOptions: [
      {
        title: { type: String },
        style: { type: String },
        isSelected: { type: Boolean, default: false },
        characterCount: { type: Number },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    brand: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
      default: "",
    },
    productType: {
      type: String,
      trim: true,
      default: "",
    },
    // Descriptions & Copy
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [8000, "Description cannot exceed 8000 characters"],
    },
    keyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    usageInstructions: {
      type: String,
      default: "",
    },
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    // Technical Specifications
    technicalSpecifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String, default: "" },
        verified: { type: Boolean, default: true },
      },
    ],
    materialComposition: {
      type: String,
      default: "",
    },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      unit: { type: String, default: "cm", enum: ["cm", "in", "mm", "m", "ft"] },
    },
    weight: {
      value: { type: Number, default: 0 },
      unit: { type: String, default: "g", enum: ["g", "kg", "lb", "oz"] },
    },
    color: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    style: {
      type: String,
      default: "",
    },
    modelNumber: {
      type: String,
      default: "",
    },
    packageContents: {
      type: String,
      default: "",
    },
    manufacturer: {
      type: String,
      default: "",
    },
    countryOfOrigin: {
      type: String,
      default: "India",
    },
    // Pricing & Inventory
    price: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Price must be positive"],
      index: true,
    },
    mrp: {
      type: Number,
      default: 0,
    },
    costPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 10,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    // Barcode & Taxes
    barcode: {
      type: { type: String, default: "EAN", enum: ["EAN", "UPC", "GTIN", "ISBN", "None"] },
      value: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },
    hsnCode: {
      type: String,
      default: "",
    },
    gstPercentage: {
      type: Number,
      default: 18,
    },
    // Images & Media
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
        isPrimary: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        backgroundType: { type: String, default: "original", enum: ["original", "white", "lifestyle", "infographic", "studio"] },
        width: { type: Number, default: 1000 },
        height: { type: Number, default: 1000 },
        processed: { type: Boolean, default: false },
      },
    ],
    // SEO & Search Keywords
    keywords: {
      primary: [{ type: String, trim: true }],
      secondary: [{ type: String, trim: true }],
      longTail: [{ type: String, trim: true }],
      searchTerms: [{ type: String, trim: true }],
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      slug: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
    },
    // Policies
    warrantyCare: {
      warrantyTerms: { type: String, default: "1 Year Manufacturer Warranty" },
      careInstructions: { type: String, default: "Handle with care. Store in dry place." },
      returnPeriodDays: { type: Number, default: 7 },
    },
    // Field Integrity, Verification & Protection Locks
    fieldLocks: {
      title: { type: Boolean, default: false },
      description: { type: Boolean, default: false },
      price: { type: Boolean, default: false },
      specs: { type: Boolean, default: false },
      bullets: { type: Boolean, default: false },
      images: { type: Boolean, default: false },
    },
    fieldStatus: {
      title: { type: String, default: "entered", enum: ["verified", "entered", "ai_suggested", "unconfirmed"] },
      description: { type: String, default: "entered", enum: ["verified", "entered", "ai_suggested", "unconfirmed"] },
      price: { type: String, default: "verified", enum: ["verified", "entered", "ai_suggested", "unconfirmed"] },
      specs: { type: String, default: "entered", enum: ["verified", "entered", "ai_suggested", "unconfirmed"] },
      bullets: { type: String, default: "ai_suggested", enum: ["verified", "entered", "ai_suggested", "unconfirmed"] },
    },
    // Marketplace Overrides and Profiles
    marketplaceOverrides: {
      amazon_in: {
        title: { type: String, default: "" },
        bullets: [{ type: String }],
        searchTerms: { type: String, default: "" },
        isValid: { type: Boolean, default: false },
        errors: [{ type: String }],
      },
      flipkart: {
        title: { type: String, default: "" },
        bullets: [{ type: String }],
        isValid: { type: Boolean, default: false },
        errors: [{ type: String }],
      },
      meesho: {
        title: { type: String, default: "" },
        bullets: [{ type: String }],
        isValid: { type: Boolean, default: false },
        errors: [{ type: String }],
      },
      shopify: {
        handle: { type: String, default: "" },
        tags: [{ type: String }],
        isValid: { type: Boolean, default: false },
        errors: [{ type: String }],
      },
    },
    // Publishing & Quality Pipeline
    status: {
      type: String,
      enum: ["draft", "needs_review", "validated", "approved", "exported", "submitted", "published", "failed"],
      default: "draft",
      index: true,
    },
    validationResults: {
      isValid: { type: Boolean, default: true },
      readinessScore: { type: Number, default: 85 },
      errors: [
        {
          field: { type: String },
          message: { type: String },
          marketplace: { type: String },
        },
      ],
      warnings: [
        {
          field: { type: String },
          message: { type: String },
          marketplace: { type: String },
        },
      ],
      lastChecked: { type: Date, default: Date.now },
    },
    source: {
      type: String,
      enum: ["manual", "csv", "xlsx", "pdf", "url", "duplicate", "marketplace_sync"],
      default: "manual",
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

catalogueProductSchema.index({ organizationId: 1, sku: 1 }, { unique: true });
catalogueProductSchema.index({ organizationId: 1, category: 1 });
catalogueProductSchema.index({ organizationId: 1, status: 1 });
catalogueProductSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("CatalogueProduct", catalogueProductSchema);
