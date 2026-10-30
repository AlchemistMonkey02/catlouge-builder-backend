require("dotenv").config();
const connectDB = require("../config/db");
const Company = require("../models/Company");
const CatalogueProduct = require("../models/CatalogueProduct");
const { getDefaultOrganization } = require("../middleware/authMiddleware");

const run = async () => {
  await connectDB();
  const org = await getDefaultOrganization();

  console.log("Connected to MongoDB Atlas!");

  // Find or create Supreme Granite & Stones
  let supreme = await Company.findOne({
    organizationId: org._id,
    name: "Supreme Granite & Stones",
  });

  if (!supreme) {
    supreme = await Company.create({
      organizationId: org._id,
      name: "Supreme Granite & Stones",
      tagline: "Natural • Durable • Timeless",
      industry: "Granite & Natural Stone",
      logoUrl: "/assets/reference/p1_2.png",
      brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
      contact: {
        email: "info@supremestones.in",
        phone: "+91 9066804666",
        website: "https://www.supremestones.in",
        address: "15 16-1A, 21st Mile Stone, Malle Nalsandra, Jigani, Nallasandra, Karnataka – 560083",
      },
      qrLinks: {
        businessProfile: "https://www.supremestones.in/catalogue",
        whatsapp: "https://wa.me/919066804666",
        website: "https://www.supremestones.in",
        location: "https://maps.google.com/?q=15+16-1A+21st+Mile+Stone+Malle+Nalsandra+Jigani+Karnataka",
        instagram: "https://instagram.com/supremestones",
        custom: "",
        customLabel: "Scan to Inquire",
      },
      legal: { gstNumber: "29AAGCS1234F1Z9", taxId: "PAN-SUPR1234S", currency: "INR" },
      wholesaleTerms: "We trade across India with Nationwide Coverage, ensuring smooth execution from selection to completion. Calibrated and box packed.",
      isDefault: true,
    });
    console.log("Created Supreme Granite & Stones company!");
  } else {
    supreme.logoUrl = "/assets/reference/p1_2.png";
    supreme.tagline = "Natural • Durable • Timeless";
    supreme.brandColors = { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" };
    supreme.contact = {
      email: "info@supremestones.in",
      phone: "+91 9066804666",
      website: "https://www.supremestones.in",
      address: "15 16-1A, 21st Mile Stone, Malle Nalsandra, Jigani, Nallasandra, Karnataka – 560083",
    };
    supreme.qrLinks = {
      businessProfile: "https://www.supremestones.in/catalogue",
      whatsapp: "https://wa.me/919066804666",
      website: "https://www.supremestones.in",
      location: "https://maps.google.com/?q=15+16-1A+21st+Mile+Stone+Malle+Nalsandra+Jigani+Karnataka",
      instagram: "https://instagram.com/supremestones",
      custom: "",
      customLabel: "Scan to Inquire",
    };
    await supreme.save();
    console.log("Updated Supreme Granite & Stones company!");
  }

  // Kota Stone products from the PDF catalogue
  const kotaProducts = [
    {
      sku: "KS-01-NGKS",
      name: "Kota Stone Natural Green",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 85,
      mrp: 140,
      stock: 5000,
      color: "Natural Green",
      materialComposition: "Fine-Grained Natural Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 24, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_1.jpg",
      shortDescription: "Fine-grained limestone from Kota region, layered naturally with exceptional compressive strength and safe wet grip.",
      description: "Kota Stone is a fine-grained limestone from the extensive Kota region of Rajasthan. Known for its layered formation and naturally cemented structure, it features unique grey and green hues. Sourced directly from quarries for exceptional durability.",
      keyFeatures: [
        "EXCEPTIONAL DURABILITY: High compressive strength enables it to withstand heavy foot traffic.",
        "NATURALLY NON-SLIP SURFACE: The texture retains safe grip even when wet, making it ideal for walkways and poolside areas.",
        "ECO-FRIENDLY & NATURAL: Sustainable, cool-to-touch material with unique mineral patterns.",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft [22\" x 22\"], 2 ft x 4 ft [22\" x 46\"]" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Finishes", value: "Semi. Polish, High. Polish, Mirror. Polish, Leather, Rough, Satin" },
        { key: "Packing", value: "With Calibration and Box Packing" },
      ],
      status: "approved",
    },
    {
      sku: "KS-02-NYKS",
      name: "Kota Stone Natural Yellow",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 90,
      mrp: 145,
      stock: 3500,
      color: "Natural Yellow",
      materialComposition: "Fine-Grained Natural Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 24, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_2.jpg",
      shortDescription: "Warm earth-toned yellow limestone tiles, ideal for interior residential floors, courtyards, and heritage projects.",
      description: "Naturally layered Kota yellow stone displaying rich mineral veins and soothing desert tones. Precision-calibrated and box-packed for easy installation.",
      keyFeatures: [
        "Warm natural yellow hues with earthy warmth",
        "Heat resistant and naturally cool to barefoot touch",
        "Multiple finishes: Leather, Mirror, Semi-Polish",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft, 2 ft x 4 ft" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Compressive Strength", value: "2100 kg/cm²" },
      ],
      status: "approved",
    },
    {
      sku: "KS-03-MRKS",
      name: "Mandana Red Natural Stone",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 95,
      mrp: 155,
      stock: 4000,
      color: "Mandana Red",
      materialComposition: "Sandstone / Hard Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 25, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_3.jpg",
      shortDescription: "Distinctive terracotta red hard stone suitable for rugged outdoor pathways, landscaping, and heritage restorations.",
      description: "Mandana Red stone provides intense color stability, weather resistance, and non-slip texture even in severe monsoon climates.",
      keyFeatures: [
        "Stunning terracotta red natural texture",
        "High abrasion resistance for heavy commercial pedestrian traffic",
        "Rough and leather finish options",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft, 2 ft x 4 ft" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Water Absorption", value: "< 0.5%" },
      ],
      status: "approved",
    },
    {
      sku: "KS-04-CBKS",
      name: "Kota Stone Charcoal Black",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 110,
      mrp: 175,
      stock: 3000,
      color: "Charcoal Black",
      materialComposition: "Dense Carbonaceous Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 24, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_4.jpg",
      shortDescription: "Ultra-sleek modern dark limestone with matte charcoal and deep midnight tones, favorite for contemporary spaces.",
      description: "Dense and rich charcoal black Kota stone. Looks dramatic when treated with mirror polish or satin leather finish.",
      keyFeatures: [
        "Sleek modern minimalist aesthetic",
        "Perfect for staircases, luxury interior flooring, and commercial lobbies",
        "Exceptional hardness and stain resistance",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft, 2 ft x 4 ft" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Finishes", value: "Mirror Polish, Leather, Satin" },
      ],
      status: "approved",
    },
    {
      sku: "KS-05-NGKS",
      name: "Kota Stone Natural Grey",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 88,
      mrp: 140,
      stock: 6000,
      color: "Natural Grey",
      materialComposition: "Fine-Grained Natural Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 24, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_5.jpg",
      shortDescription: "Balanced neutral grey stone providing a subtle, sophisticated backdrop for contemporary architectural designs.",
      description: "Neutral grey shade Kota limestone with uniform grain and consistent coloration. Widely specified by leading architects.",
      keyFeatures: [
        "Neutral slate-grey tone complements all interior palettes",
        "Extremely low maintenance and durable",
        "Available in CNC patterns: Radial, Diamond, Square",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft, 2 ft x 4 ft" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Density", value: "2.68 g/cm³" },
      ],
      status: "approved",
    },
    {
      sku: "KS-06-NBKS",
      name: "Kota Stone Natural Blue",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Natural Stone",
      price: 92,
      mrp: 150,
      stock: 2500,
      color: "Natural Blue",
      materialComposition: "Fine-Grained Natural Limestone",
      dimensions: { length: 60, width: 60, height: 2, unit: "cm" },
      weight: { value: 24, unit: "kg" },
      hsnCode: "6802",
      image: "/assets/reference/p4_6.jpg",
      shortDescription: "Rare natural blue-green hue limestone giving coastal poolsides and luxury hospitality spaces an ethereal charm.",
      description: "Quarried from specialized deep layers in Kota, this stone offers a tranquil cool blue hue with high slip resistance.",
      keyFeatures: [
        "Rare natural blue limestone tint",
        "Ideal for swimming pools, wellness retreats, and luxury verandas",
        "Naturally textured and expertly finished",
      ],
      technicalSpecifications: [
        { key: "Sizes Available", value: "2 ft x 2 ft, 2 ft x 4 ft" },
        { key: "Thickness", value: "18 - 20 mm" },
        { key: "Hardness (Mohs)", value: "3.5 - 4.0" },
      ],
      status: "approved",
    },
  ];

  for (const prod of kotaProducts) {
    const existing = await CatalogueProduct.findOne({
      organizationId: org._id,
      sku: prod.sku,
    });
    if (!existing) {
      await CatalogueProduct.create(prod);
      console.log(`Created: ${prod.sku}`);
    } else {
      existing.image = prod.image;
      existing.companyId = supreme._id;
      existing.name = prod.name;
      existing.category = prod.category;
      existing.technicalSpecifications = prod.technicalSpecifications;
      await existing.save();
      console.log(`Updated: ${prod.sku}`);
    }
  }

  console.log("Supreme Granite & Stones seed complete!");
  process.exit(0);
};

run().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
