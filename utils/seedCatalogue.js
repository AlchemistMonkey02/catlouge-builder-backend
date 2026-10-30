require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const CatalogueProduct = require("../models/CatalogueProduct");
const Organization = require("../models/Organization");
const { getDefaultOrganization } = require("../middleware/authMiddleware");
const { auditProductAcrossMarketplaces } = require("../services/marketplaceEngine");

const seedProducts = [
  {
    sku: "APX-TECH-NC100",
    name: "ai SonicWave Pro Wireless ANC Headphones - Matte Onyx Edition",
    brand: "ai",
    category: "Electronics",
    subcategory: "Audio & Headphones",
    productType: "Over-Ear Headphones",
    shortDescription: "Flagship active noise-cancelling headphones featuring 40mm beryllium drivers, 45-hour battery life, and ultra-comfortable memory foam earcups.",
    description: "Immerse yourself in studio-grade acoustics with the ai SonicWave Pro. Engineered with hybrid active noise cancellation, these headphones eliminate up to 98% of ambient noise.\n\nFeaturing proprietary 40mm beryllium acoustic drivers, every frequency is delivered with surgical precision—from sub-bass impact to crystal-clear trebles. Multi-point Bluetooth 5.3 allows seamless switching between your laptop and smartphone.\n\nCrafted with aerospace-grade anodized aluminum and wrapped in memory foam cushions, the SonicWave Pro provides all-day listening luxury backed by a comprehensive 1-year warranty.",
    keyFeatures: [
      "HYBRID ACTIVE NOISE CANCELLATION: Dual-feed microphones reduce background noise by up to 98% for pure focus.",
      "40MM BERYLLIUM DRIVERS: Delivers high-resolution certified audio with deep bass and pristine highs.",
      "45-HOUR PLAYBACK: Fast USB-C charging delivers 5 hours of playback with just 10 minutes of charge.",
      "MULTIPONT CONNECTIVITY: Pair simultaneously with two devices and switch seamlessly.",
      "ERGONOMIC LUXURY: Protein leather ear cushions with pressure-relieving memory foam headband.",
    ],
    technicalSpecifications: [
      { key: "Driver Size", value: "40mm", verified: true },
      { key: "Battery Life", value: "45 Hours (ANC On)", verified: true },
      { key: "Bluetooth Version", value: "5.3 LE", verified: true },
      { key: "Charging Port", value: "USB-C Fast Charge", verified: true },
      { key: "Weight", value: "250g", verified: true },
    ],
    price: 6499,
    mrp: 11999,
    costPrice: 3200,
    stock: 85,
    color: "Matte Onyx",
    materialComposition: "Anodized Aluminum & Memory Foam",
    dimensions: { length: 20, width: 18, height: 8, unit: "cm" },
    weight: { value: 250, unit: "g" },
    hsnCode: "85183000",
    gstPercentage: 18,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        isPrimary: true,
        backgroundType: "white",
        width: 1200,
        height: 1200,
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
        isPrimary: false,
        backgroundType: "lifestyle",
        width: 1200,
        height: 1200,
      },
    ],
    keywords: {
      primary: ["anc headphones", "bluetooth wireless headphones", "ai audio"],
      secondary: ["noise cancelling over ear", "headphones with mic", "long battery headphones"],
      searchTerms: ["headphones", "wireless", "anc", "bluetooth", "bass", "audio", "mic"],
    },
    status: "approved",
  },
  {
    sku: "APX-FASH-TEE88",
    name: "ai AeroKnit 100% Organic Supima Cotton Relaxed Fit T-Shirt",
    brand: "ai",
    category: "Fashion",
    subcategory: "Men's Apparel",
    productType: "T-Shirt",
    shortDescription: "Ultra-heavyweight 240 GSM organic Supima cotton t-shirt designed for a relaxed streetwear drape and maximum breathability.",
    description: "Redefine your everyday wardrobe with the ai AeroKnit Relaxed Tee. Tailored from 100% certified long-staple Supima cotton, this t-shirt offers a silky handfeel and exceptional drape.\n\nPre-shrunk and bio-washed for color retention, it features double-needle reinforced stitching across the collar, hem, and cuffs for years of shape retention.\n\nSustainably dyed using OEKO-TEX certified non-toxic pigments, safe for your skin and the environment.",
    keyFeatures: [
      "100% SUPIMA ORGANIC COTTON: Crafted from long-staple cotton for unmatched softness and breathability.",
      "240 GSM HEAVYWEIGHT DRAPE: Premium tailored silhouette that holds structure without clinging.",
      "DOUBLE-STITCHED DURABILITY: Ribbed collar and reinforced hems prevent sagging after wash cycles.",
      "OEKO-TEX CERTIFIED: Sustainably dyed with zero toxic chemicals.",
    ],
    technicalSpecifications: [
      { key: "Fabric Weight", value: "240 GSM", verified: true },
      { key: "Fit Type", value: "Relaxed Fit", verified: true },
      { key: "Weave", value: "Single Jersey", verified: true },
      { key: "Care", value: "Machine Wash Cold", verified: true },
    ],
    price: 999,
    mrp: 1899,
    costPrice: 420,
    stock: 240,
    color: "Sage Green",
    size: "L",
    materialComposition: "100% Organic Supima Cotton",
    dimensions: { length: 30, width: 25, height: 2, unit: "cm" },
    weight: { value: 260, unit: "g" },
    hsnCode: "61091000",
    gstPercentage: 5,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        isPrimary: true,
        backgroundType: "white",
        width: 1000,
        height: 1000,
      },
    ],
    keywords: {
      primary: ["cotton t shirt", "oversized tee", "organic cotton t-shirt"],
      secondary: ["streetwear men tee", "heavyweight supima tee"],
      searchTerms: ["tshirt", "cotton", "menswear", "tee", "casual", "organic"],
    },
    status: "validated",
  },
  {
    sku: "APX-HOME-AIR50",
    name: "ai PureBreeze Smart HEPA H13 Air Purifier with Real-Time Air Quality Sensor",
    brand: "ai",
    category: "Home",
    subcategory: "Home Appliances",
    productType: "Air Purifier",
    shortDescription: "Medical-grade True HEPA H13 smart air purifier covering up to 450 sq. ft with whisper-quiet 22dB sleep mode.",
    description: "Breathe cleaner, healthier air with the ai PureBreeze Smart Air Purifier. Featuring a medical-grade 3-stage filtration system, it captures 99.97% of airborne pollutants down to 0.1 microns, including dust, pet dander, pollen, smoke, and odors.\n\nThe integrated laser PM2.5 sensor provides real-time ambient quality feedback via a color-coded LED display and automatically adjusts fan speeds in smart mode.",
    keyFeatures: [
      "TRUE HEPA H13 FILTRATION: Eliminates 99.97% of pollen, dust, pet dander, and allergens.",
      "450 SQ FT COVERAGE: Delivers Clean Air Delivery Rate (CADR) of 280 m³/h in 15 minutes.",
      "WHISPER QUIET SLEEP MODE: Operates at an ultra-silent 22dB with display lights dimmed.",
      "REAL-TIME PM2.5 LASER SENSOR: Color-coded air quality ring adjusts fan automatically.",
    ],
    technicalSpecifications: [
      { key: "CADR Rating", value: "280 m³/h", verified: true },
      { key: "Coverage Area", value: "450 sq. ft", verified: true },
      { key: "Filter Type", value: "True HEPA H13 + Carbon", verified: true },
      { key: "Noise Level", value: "22 - 48 dB", verified: true },
    ],
    price: 7999,
    mrp: 14999,
    costPrice: 4200,
    stock: 42,
    color: "Arctic White",
    materialComposition: "Flame-Retardant ABS & Carbon Composite",
    dimensions: { length: 35, width: 22, height: 50, unit: "cm" },
    weight: { value: 4200, unit: "g" },
    hsnCode: "84213920",
    gstPercentage: 18,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
        isPrimary: true,
        backgroundType: "white",
        width: 1200,
        height: 1200,
      },
    ],
    keywords: {
      primary: ["air purifier hepa", "smart air purifier", "home air filter"],
      secondary: ["air purifier for bedroom", "allergy relief purifier"],
      searchTerms: ["air", "purifier", "hepa", "filter", "clean", "pollution", "pm2.5"],
    },
    status: "approved",
  },
  {
    sku: "APX-SPRT-BOTL1",
    name: "ai HydrateMax Insulated Stainless Steel Sports Flask - 1000ml",
    brand: "ai",
    category: "Sports",
    subcategory: "Fitness & Outdoors",
    productType: "Water Bottle",
    shortDescription: "Triple-vacuum insulated 18/8 food-grade stainless steel bottle keeping beverages cold for 24 hours or hot for 12 hours.",
    description: "Stay hydrated wherever adventure leads with the ai HydrateMax Sports Flask. Crafted from heavy-gauge 18/8 kitchen-grade stainless steel, this 1000ml flask resists dents and preserves the pure flavor of your beverages.\n\nFeatures a sweat-free powder coating for secure grip, leakproof silicone seals, and a wide mouth opening that effortlessly accommodates ice cubes.",
    keyFeatures: [
      "TRIPLE VACUUM INSULATION: Keeps liquids icy cold for 24 hours or steaming hot for 12 hours.",
      "18/8 PRO-GRADE STAINLESS STEEL: Rust-proof, BPA-free, and retains zero flavors or odors.",
      "LEAKPROOF SPORT SPOUT LID: Silicone gasket guarantees 100% spill-proof performance in bags.",
      "POWDER COAT FINISH: Non-slip tactile grip that never sweats or condensates.",
    ],
    technicalSpecifications: [
      { key: "Capacity", value: "1000ml / 32oz", verified: true },
      { key: "Material", value: "18/8 Stainless Steel", verified: true },
      { key: "Insulation", value: "Double Wall Vacuum", verified: true },
      { key: "Lid Type", value: "Spout with Carabiner Loop", verified: true },
    ],
    price: 1199,
    mrp: 1999,
    costPrice: 480,
    stock: 150,
    color: "Midnight Blue",
    materialComposition: "18/8 Stainless Steel",
    dimensions: { length: 9, width: 9, height: 28, unit: "cm" },
    weight: { value: 430, unit: "g" },
    hsnCode: "73239390",
    gstPercentage: 18,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    images: [
      {
        url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
        isPrimary: true,
        backgroundType: "white",
        width: 1000,
        height: 1000,
      },
    ],
    keywords: {
      primary: ["insulated water bottle", "gym stainless steel bottle", "sports flask"],
      secondary: ["hot and cold bottle 1000ml", "bpa free flask"],
      searchTerms: ["bottle", "flask", "insulated", "water", "gym", "steel"],
    },
    status: "validated",
  },
];

const seed = async () => {
  await connectDB();
  const org = await getDefaultOrganization();

  console.log(`Using organization: ${org.name} (${org._id})`);

  const Company = require("../models/Company");
  const companies = await Company.find({ organizationId: org._id });
  const compMap = {};
  companies.forEach((c) => {
    if (c.name.includes("Audio")) compMap.Electronics = c._id;
    if (c.name.includes("Velvet")) compMap.Fashion = c._id;
    if (c.name.includes("Nordic")) compMap.Home = c._id;
    if (c.name.includes("Aura")) compMap.Sports = c._id;
  });

  const defaultComp = companies[0]?._id;

  for (const item of seedProducts) {
    item.companyId = compMap[item.category] || defaultComp;
    const existing = await CatalogueProduct.findOne({
      organizationId: org._id,
      sku: item.sku,
    });

    const audit = auditProductAcrossMarketplaces(item);
    item.organizationId = org._id;
    item.validationResults = {
      isValid: audit.isValid,
      readinessScore: audit.readinessScore,
      errors: Object.values(audit.results).flatMap((r) => r.errors),
      warnings: Object.values(audit.results).flatMap((r) => r.warnings),
      lastChecked: new Date(),
    };

    if (!existing) {
      await CatalogueProduct.create(item);
      console.log(`Created seeded product: ${item.sku}`);
    } else {
      existing.companyId = item.companyId;
      await existing.save();
      console.log(`Updated company on product: ${item.sku} -> ${item.companyId}`);
    }
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
