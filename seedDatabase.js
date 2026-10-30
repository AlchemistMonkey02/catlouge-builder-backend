/**
 * Master Database Seeder for Catalogue Builder
 * 
 * Seeds all:
 * 1. Default Organization & Tenant Context
 * 2. Multi-Company Brand Profiles (Garlic, Kota Stone, Sand Stone, Kota Doria, Tech/Studio)
 * 3. Complete Catalogue Products (all 20+ specialty products with exact specs, multi-angle images, prices)
 * 4. AI Studio Phone Shots & Lifestyle Products
 * 5. Pre-saved Dynamic Catalogue Records (ODOP / Studio Database)
 * 6. Legacy Storefront Products
 */

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Organization = require("./models/Organization");
const Company = require("./models/Company");
const CatalogueProduct = require("./models/CatalogueProduct");
const CatalogueRecord = require("./models/CatalogueRecord");
const Product = require("./models/Product");
const { getDefaultOrganization } = require("./middleware/authMiddleware");

const seedDatabase = async () => {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await connectDB();
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // 1. Ensure Default Organization
    const org = await getDefaultOrganization();
    console.log(`🏢 Default Organization ready: "${org.name}" (${org._id})`);

    // 2. Companies / Brand Profiles
    console.log("\n📦 Seeding Brand Profiles...");
    const companiesToSeed = [
      {
        name: "Supreme Granite & Stones",
        tagline: "Natural • Durable • Architectural Precision Slabs",
        industry: "Kota Stone & Calibrated Limestone",
        logoUrl: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
        brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
        contact: {
          email: "sales@supremestones.in",
          phone: "+91 90668 04666",
          website: "https://www.supremestones.in",
          address: "15 16-1A, 21st Mile Stone, Jigani Industrial Area, Bangalore – 560083",
        },
        qrLinks: {
          businessProfile: "https://www.supremestones.in/catalogue",
          whatsapp: "https://wa.me/919066804666",
          website: "https://www.supremestones.in",
          location: "https://maps.google.com/?q=Jigani+Industrial+Area+Bangalore",
          instagram: "https://instagram.com/supremestones",
          custom: "",
          customLabel: "Scan for Quarry Pricing",
        },
        legal: { gstNumber: "29AAGCS1234F1Z9", taxId: "PAN-SUPR1234S", currency: "INR" },
        wholesaleTerms: "Calibrated 18-20mm & 25-30mm dimensional slabs with protective wooden pallet box packaging. High compressive strength ASTM tested. FOB Mudra/Kandla & Pan-India dispatch.",
        isDefault: true,
      },
      {
        name: "Parampara Threads",
        tagline: "Royal Gossamer Handlooms • GI Tagged Atelier",
        industry: "Kota Doria Handlooms & Sarees",
        logoUrl: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        brandColors: { primary: "#7c2d12", secondary: "#431407", accent: "#d97706" },
        contact: {
          email: "orders@paramparathreads.com",
          phone: "+91 94141 23456",
          website: "https://www.paramparathreads.com",
          address: "Weavers Colony, Kaithun, Kota District, Rajasthan – 325001",
        },
        qrLinks: {
          businessProfile: "https://www.paramparathreads.com/catalogue",
          whatsapp: "https://wa.me/919414123456",
          website: "https://www.paramparathreads.com",
          location: "https://maps.google.com/?q=Kaithun+Kota+Rajasthan",
          instagram: "https://instagram.com/paramparathreads",
          custom: "",
          customLabel: "Scan for GI Tag Certification",
        },
        legal: { gstNumber: "08AAGCP9876K1Z2", taxId: "PAN-PRMP9876K", currency: "INR" },
        wholesaleTerms: "Authentic Geographical Indication (GI Tag No. 37) certified handloom sarees and dupattas. Minimum order 10 pieces for boutique and designer houses.",
        isDefault: false,
      },
      {
        name: "Royal Heritage Sandstones",
        tagline: "Palatial Jodhpur & Agra Red Sandstones",
        industry: "Sandstone Facades & Landscaping",
        logoUrl: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        brandColors: { primary: "#b45309", secondary: "#451a03", accent: "#f59e0b" },
        contact: {
          email: "export@royalsandstone.in",
          phone: "+91 98290 54321",
          website: "https://www.royalsandstone.in",
          address: "Mandore Stone Industrial Zone, Jodhpur, Rajasthan – 342007",
        },
        qrLinks: {
          businessProfile: "https://www.royalsandstone.in/catalogue",
          whatsapp: "https://wa.me/919829054321",
          website: "https://www.royalsandstone.in",
          location: "https://maps.google.com/?q=Mandore+Stone+Industrial+Zone+Jodhpur",
          instagram: "https://instagram.com/royalsandstone",
          custom: "",
          customLabel: "Scan for Architectural Catalog",
        },
        legal: { gstNumber: "08AAGCR5432M1Z5", taxId: "PAN-ROYS5432M", currency: "INR" },
        wholesaleTerms: "International sea container payload. ASTM C616 standard certified. Architectural cut-to-size slabs, hand-chiseled rockface veneers, and CNC carved jali screens.",
        isDefault: false,
      },
      {
        name: "Malwa Agro Fresh & Garlic Exports",
        tagline: "Sun-Cured Grade-A White Garlic • Direct Malwa Farm Collective",
        industry: "Garlic Specialty & Agri Commodity",
        logoUrl: "/assets/garlic/garlic-01.jpeg",
        brandColors: { primary: "#1b4332", secondary: "#2d6a4f", accent: "#d4af37" },
        contact: {
          email: "procurement@malwagarlic.in",
          phone: "+91 97521 09876",
          website: "https://www.malwagarlic.in",
          address: "Krishi Upaj Mandi Yard, Mandsaur - Kota Agro Corridor, MP/Rajasthan – 458001",
        },
        qrLinks: {
          businessProfile: "https://www.malwagarlic.in/catalogue",
          whatsapp: "https://wa.me/919752109876",
          website: "https://www.malwagarlic.in",
          location: "https://maps.google.com/?q=Krishi+Upaj+Mandi+Mandsaur",
          instagram: "https://instagram.com/malwagarlicexports",
          custom: "",
          customLabel: "Scan to Order Fresh Harvest",
        },
        legal: { gstNumber: "23AAGCM4321P1Z8", taxId: "PAN-MLWG4321P", currency: "INR" },
        wholesaleTerms: "20ft/40ft Reefer container & ventilated mesh bags. Phytosanitary & Global GAP certified. High allicin pungency and triple hand-graded.",
        isDefault: false,
      },
      // Aliases to guarantee matching for any component or template
      {
        name: "Supreme Kota Stone & Minerals",
        tagline: "Architectural Precision Calibrated Stone",
        industry: "Kota Stone Specialty",
        logoUrl: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
        brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
        contact: {
          email: "sales@supremestones.in",
          phone: "+91 90668 04666",
          website: "https://www.supremestones.in",
          address: "Ramganjmandi, Kota, Rajasthan – 326519",
        },
        isDefault: false,
      },
      {
        name: "Kaithun Royal Kota Doria Handlooms",
        tagline: "Authentic Khat Weave • Pure Zari Handlooms",
        industry: "Kota Doria Specialty",
        logoUrl: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        brandColors: { primary: "#7c2d12", secondary: "#431407", accent: "#d97706" },
        contact: {
          email: "heritage@kaithunkotadoria.org",
          phone: "+91 94141 23456",
          website: "https://www.paramparathreads.com",
          address: "Kaithun, Kota, Rajasthan – 325001",
        },
        isDefault: false,
      },
      {
        name: "Marwar Royal Sandstone & Facades",
        tagline: "Imperial Desert Gold & Red Sandstones",
        industry: "Sand Stone Specialty",
        logoUrl: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        brandColors: { primary: "#b45309", secondary: "#451a03", accent: "#f59e0b" },
        contact: {
          email: "export@royalsandstone.in",
          phone: "+91 98290 54321",
          website: "https://www.royalsandstone.in",
          address: "Jodhpur, Rajasthan – 342007",
        },
        isDefault: false,
      },
      {
        name: "Malwa Fresh Garlic & Agro Exports",
        tagline: "100% Sun-Cured Malwa Farm Garlic",
        industry: "Garlic Specialty",
        logoUrl: "/assets/garlic/garlic-01.jpeg",
        brandColors: { primary: "#1b4332", secondary: "#2d6a4f", accent: "#d4af37" },
        contact: {
          email: "procurement@malwagarlic.in",
          phone: "+91 97521 09876",
          website: "https://www.malwagarlic.in",
          address: "Mandsaur, MP – 458001",
        },
        isDefault: false,
      },
      {
        name: "ai Studio Brands & Electronics",
        tagline: "Next-Gen Audio, Apparel & Smart Lifestyle Essentials",
        industry: "Consumer Electronics & Fashion",
        logoUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        brandColors: { primary: "#0A2540", secondary: "#0066CC", accent: "#FF0080" },
        contact: {
          email: "support@aistudio.com",
          phone: "+91 98765 43210",
          website: "https://aistudio.example.com",
          address: "Cyber City, DLF Phase II, Gurugram – 122002",
        },
        isDefault: false,
      }
    ];

    const companyMap = {};
    for (const cData of companiesToSeed) {
      let comp = await Company.findOne({ organizationId: org._id, name: cData.name });
      if (!comp) {
        comp = await Company.create({ ...cData, organizationId: org._id });
        console.log(`  ➕ Created Company: "${comp.name}"`);
      } else {
        Object.assign(comp, cData);
        await comp.save();
        console.log(`  🔄 Updated Company: "${comp.name}"`);
      }
      companyMap[cData.name] = comp;
    }

    const supreme = companyMap["Supreme Granite & Stones"];
    const parampara = companyMap["Parampara Threads"];
    const royalSandstone = companyMap["Royal Heritage Sandstones"];
    const malwaGarlic = companyMap["Malwa Agro Fresh & Garlic Exports"];
    const techStudio = companyMap["ai Studio Brands & Electronics"];

    // 3. Catalogue Products
    console.log("\n🛍️ Seeding Products (Garlic, Kota Stone, Sand Stone, Kota Doria, Tech)...");
    const productsToSeed = [
      // ----------------------------------------------------
      // 🧄 GARLIC SPECIALTY
      // ----------------------------------------------------
      {
        sku: "GRL-01-EXP",
        name: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
        brand: malwaGarlic.name,
        companyId: malwaGarlic._id,
        category: "Garlic Specialty",
        subcategory: "Whole Bulbs",
        productType: "Fresh Garlic",
        price: 180,
        mrp: 240,
        stock: 12000,
        image: "/assets/garlic/garlic-01.jpeg",
        images: [
          { url: "/assets/garlic/garlic-01.jpeg", alt: "Angle 1 (Hero - Large Farm Harvest Bulbs)", isPrimary: true },
          { url: "/assets/garlic/garlic-02.jpeg", alt: "Angle 2 (Bulb Caliber & Root Clean Finish)" },
          { url: "/assets/garlic/garlic-03.jpeg", alt: "Angle 3 (Clean White Sun-Cured Skin)" },
          { url: "/assets/garlic/garlic-04.jpeg", alt: "Angle 4 (Harvest Mesh Bag Packing Sizing)" }
        ],
        shortDescription: "Sun-cured large caliber garlic bulbs from Malwa soil with papery white skins and rich aromatic allicin.",
        description: "Direct farm procurement featuring high allicin pungency, pesticide-free soil cultivation, and strict multi-stage mechanical caliber sorting (50-65mm). Clean white skin with intact outer cloves and tight neck closure.",
        keyFeatures: [
          "Caliber 50-65mm strictly graded for export markets",
          "Sun-cured under natural Malwa plateau sunshine",
          "Rich pungent allicin aroma and long shelf life",
          "Packed in 10kg and 20kg red leno mesh bags"
        ],
        technicalSpecifications: [
          { key: "Bulb Caliber", value: "50-65 mm" },
          { key: "Moisture Content", value: "< 64% Max" },
          { key: "Packing", value: "10/20kg Ventilated Red Mesh Bags" },
          { key: "Certification", value: "Global GAP & APEDA Phytosanitary" },
          { key: "Origin", value: "Malwa Agricultural Belt (MP/RJ)" }
        ],
        status: "approved"
      },
      {
        sku: "GRL-02-PEEL",
        name: "Fresh Peeled Whole Garlic Cloves",
        brand: malwaGarlic.name,
        companyId: malwaGarlic._id,
        category: "Garlic Specialty",
        subcategory: "Peeled Cloves",
        productType: "Value-Added Agro",
        price: 260,
        mrp: 320,
        stock: 4500,
        image: "/assets/garlic/garlic-05.jpeg",
        images: [
          { url: "/assets/garlic/garlic-05.jpeg", alt: "Angle 1 (Fresh Cloves & Bulb Inspection)", isPrimary: true },
          { url: "/assets/garlic/garlic-06.jpeg", alt: "Angle 2 (High Allicin Pungent Bulbs)" },
          { url: "/assets/garlic/garlic-07.jpeg", alt: "Angle 3 (Export Sorting Table)" }
        ],
        shortDescription: "Air-peeled nitrogen-flushed whole garlic cloves, 100% kitchen yield ready with zero peeling prep.",
        description: "Peeled in clean-room automated facilities, preserving volatile garlic oils and allicin without water soaking or bleach. Perfect for food processing, restaurant chains, and commercial kitchens.",
        keyFeatures: [
          "100% whole cloves with zero peeling prep needed",
          "Air-peeled without water soaking to prevent spoilage",
          "Vacuum sealed with nitrogen flush for 45-day freshness",
          "Food grade 1kg pouches and 10kg bulk carton packing"
        ],
        technicalSpecifications: [
          { key: "Purity", value: "100% Sorted Whole Cloves" },
          { key: "Shelf Life", value: "45 Days at 0-4°C" },
          { key: "Packaging", value: "1kg Vacuum Pouches / 10kg Master Carton" },
          { key: "Moisture", value: "< 62%" }
        ],
        status: "approved"
      },
      {
        sku: "GRL-03-FLK",
        name: "Bulk Harvest Agro-Grade Garlic Sacks",
        brand: malwaGarlic.name,
        companyId: malwaGarlic._id,
        category: "Garlic Specialty",
        subcategory: "Commercial Lots",
        productType: "Bulk Garlic",
        price: 340,
        mrp: 420,
        stock: 25000,
        image: "/assets/garlic/garlic-08.jpeg",
        images: [
          { url: "/assets/garlic/garlic-08.jpeg", alt: "Angle 1 (Bulk Harvest Crate Stacking)", isPrimary: true },
          { url: "/assets/garlic/garlic-09.jpeg", alt: "Angle 2 (Clean Dry Storage Bulbs)" },
          { url: "/assets/garlic/garlic-10.jpeg", alt: "Angle 3 (Grading Caliber 50mm+)" }
        ],
        shortDescription: "Field-fresh sun-cured garlic in ventilated export mesh bags, calibrated for wholesale mandis.",
        description: "Heavy wholesale commodity lots, dried on raised slatted racks to guarantee mold-free storage during long transit. Calibrated for supermarket cold chains and wholesale mandis.",
        keyFeatures: [
          "Heavy wholesale commodity lots directly from farm gate",
          "Thoroughly ventilated to prevent sprout and moisture buildup",
          "Long distance ambient freight stability up to 90 days",
          "Export container payload optimized"
        ],
        technicalSpecifications: [
          { key: "Transit Stability", value: "90+ Days Ambient" },
          { key: "Stem Length", value: "< 1.5 cm Clean Cut" },
          { key: "Container Payload", value: "28 MT / 40ft Reefer Container" },
          { key: "Bulb Caliber", value: "45-60 mm" }
        ],
        status: "approved"
      },
      {
        sku: "GRL-04-BLK",
        name: "Premium Handpicked White Garlic Bulbs",
        brand: malwaGarlic.name,
        companyId: malwaGarlic._id,
        category: "Garlic Specialty",
        subcategory: "Artisanal Selection",
        productType: "Specialty Garlic",
        price: 950,
        mrp: 1250,
        stock: 1500,
        image: "/assets/garlic/garlic-11.jpeg",
        images: [
          { url: "/assets/garlic/garlic-11.jpeg", alt: "Angle 1 (Field Fresh Garlic Bulbs)", isPrimary: true },
          { url: "/assets/garlic/garlic-12.jpeg", alt: "Angle 2 (Naturally Dried Stems)" },
          { url: "/assets/garlic/garlic-13.jpeg", alt: "Angle 3 (Premium Clean Cloves Sizing)" }
        ],
        shortDescription: "Artisanal handpicked farm garlic featuring dense clove count and superior medicinal allicin potency.",
        description: "Selected exclusively from certified pesticide-free organic clusters in Malwa plateau, celebrated for spicy punch and high essential oil content. Prized by Ayurvedic and pharmaceutical buyers.",
        keyFeatures: [
          "Triple hand-graded to ensure 100% flawless bulbs",
          "Highest tested allicin and essential oil concentration",
          "Papery white multi-layered skin with dense clove clustering",
          "Ideal for organic gourmet retail and natural medicine extraction"
        ],
        technicalSpecifications: [
          { key: "Sorting", value: "100% Handpicked" },
          { key: "Allicin Index", value: "Peak Medicinal Grade" },
          { key: "Origin", value: "Kota-Mandsaur Organic Cluster" },
          { key: "Storage", value: "Ambient Ventilated 90 Days" }
        ],
        status: "approved"
      },

      // ----------------------------------------------------
      // 🏛️ KOTA STONE SPECIALTY
      // ----------------------------------------------------
      {
        sku: "KTA-01-BLU",
        name: "Kota Stone Natural Blue Calibrated Tiles",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Flooring Tiles",
        productType: "Natural Limestone",
        price: 85,
        mrp: 120,
        stock: 6000,
        image: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
        images: [
          { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg", alt: "Angle 1 (Hero - Blue Kota Slabs)", isPrimary: true },
          { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-3.jpg", alt: "Angle 2 (Close-up Texture & Grain)" },
          { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-4.jpg", alt: "Angle 3 (Cut Tile Stacks)" },
          { url: "/assets/kota-stone/Blue-Kota-Stone-Tiles-5.jpg", alt: "Angle 4 (Finished Surface Quality)" }
        ],
        shortDescription: "Fine-grained architectural blue-green limestone with natural non-slip surface and calibrated 18-20mm thickness.",
        description: "Fine-grained architectural limestone from Kota quarries with uniform blue coloration, machine gauged thickness, and R11 anti-skid wet grip. Highly resistant to weather and heavy foot traffic.",
        technicalSpecifications: [
          { key: "Thickness", value: "18-20 mm Calibrated" },
          { key: "Compressive Strength", value: "135-140 MPa" },
          { key: "Water Absorption", value: "< 0.38%" },
          { key: "Origin", value: "Kota Quarries, Rajasthan" }
        ],
        status: "approved"
      },
      {
        sku: "KTA-02-MIR",
        name: "Mirror High-Polish Kota Stone Flooring Slabs",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Polished Slabs",
        productType: "Limestone Slabs",
        price: 110,
        mrp: 155,
        stock: 4500,
        image: "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg",
        images: [
          { url: "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg", alt: "Angle 1 (High Polish Surface Reflection)", isPrimary: true },
          { url: "/assets/kota-stone/blue-kota-stone-1.jpg", alt: "Angle 2 (Natural Deep Cyan Tone)" },
          { url: "/assets/kota-stone/blue-kota-stone-2.jpg", alt: "Angle 3 (Polished Edge & Bevel Detail)" },
          { url: "/assets/kota-stone/blue-kota-stone-3.jpg", alt: "Angle 4 (Architectural Slab View)" }
        ],
        shortDescription: "Glass-like high sheen surface reflection bringing out rich blue-green natural mineral saturation.",
        description: "12-head computerized mirror polish finish that reveals the magnificent natural cyan-green limestone grain for high-traffic luxury lobbies, villas, and commercial atriums.",
        technicalSpecifications: [
          { key: "Finish", value: "12-Head Mirror Polish" },
          { key: "Sizes", value: "600x600, 600x900 mm" },
          { key: "Edge", value: "Precision Sawn & Beveled Chamfer" },
          { key: "Density", value: "2.68 g/cm³" }
        ],
        status: "approved"
      },
      {
        sku: "KTA-03-DSG",
        name: "Designer Architectural Kota Stone Tiles",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Architectural Cuts",
        productType: "Designer Pavers",
        price: 95,
        mrp: 140,
        stock: 3500,
        image: "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg",
        images: [
          { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg", alt: "Angle 1 (Designer Geometric Layout)", isPrimary: true },
          { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles-2.jpg", alt: "Angle 2 (Multi-Tone Pattern)" },
          { url: "/assets/kota-stone/Designer-Kota-Stone-Tiles-3.jpg", alt: "Angle 3 (Surface Relief & Texture)" },
          { url: "/assets/kota-stone/Designer-kota-stone-5.jpg", alt: "Angle 4 (Interior Courtyard Floor)" }
        ],
        shortDescription: "Custom geometric paving tiles and ornamental floor accents engineered for luxury villas.",
        description: "Custom geometric paving tiles and ornamental floor accents engineered for luxury villas, hospitality resorts, and grand verandas.",
        technicalSpecifications: [
          { key: "Finish", value: "Honed Satin / Leather" },
          { key: "Applications", value: "Interior & Semi-Covered Patios" },
          { key: "Density", value: "2.68 g/cm³" }
        ],
        status: "approved"
      },
      {
        sku: "KTA-04-YEL",
        name: "Natural Yellow Kota Limestone Tiles",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Yellow Limestone",
        productType: "Limestone Tiles",
        price: 90,
        mrp: 135,
        stock: 4000,
        image: "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg",
        images: [
          { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg", alt: "Angle 1 (Warm Ochre Yellow Tiles)", isPrimary: true },
          { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-1.jpg", alt: "Angle 2 (Layered Sand Veins)" },
          { url: "/assets/kota-stone/Yellow-Kota-Stone-Tiles-2.jpg", alt: "Angle 3 (Calibrated Stacks)" },
          { url: "/assets/kota-stone/yellow-brown-kota-stone-3-1.jpg", alt: "Angle 4 (Yellow-Brown Warmth)" }
        ],
        shortDescription: "Naturally layered warm earth-tone limestone tiles displaying golden undertones, naturally cool to the touch.",
        description: "Naturally layered warm earth-tone limestone tiles displaying golden undertones, naturally cool to the touch and thermal-resistant.",
        technicalSpecifications: [
          { key: "Tone", value: "Desert Gold & Warm Ochre" },
          { key: "Thickness", value: "18 - 20 mm" },
          { key: "Thermal Conductivity", value: "Naturally Cool" }
        ],
        status: "approved"
      },
      {
        sku: "KTA-05-FLR",
        name: "Calibrated Kota Stone Flooring Slabs",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Commercial Slabs",
        productType: "Commercial Flooring",
        price: 78,
        mrp: 110,
        stock: 7500,
        image: "/assets/kota-stone/Kota-Stone-Flooring-Tiles.jpg",
        images: [
          { url: "/assets/kota-stone/Kota-Stone-Flooring-Tiles.jpg", alt: "Angle 1 (Uniform Calibrated Slabs)", isPrimary: true },
          { url: "/assets/kota-stone/Kota-Stone-Flooring-3-1.jpg", alt: "Angle 2 (Clean Edge Sawn Finish)" },
          { url: "/assets/kota-stone/Kota-Stone-Flooring-5.jpg", alt: "Angle 3 (Large Format Floor Layout)" },
          { url: "/assets/kota-stone/kota-stone-flooring-2-1.jpg", alt: "Angle 4 (Quarry Direct Slabs)" }
        ],
        shortDescription: "Precision-calibrated commercial stone slabs, box-packed with protective spacers for zero-breakage transport.",
        description: "Precision-calibrated commercial stone slabs, box-packed with protective spacers for zero-breakage transport and rapid installation.",
        technicalSpecifications: [
          { key: "Calibration", value: "Machine Gauged 20mm ±1mm" },
          { key: "Slip Rating", value: "R11 Anti-Skid" },
          { key: "Standard", value: "IS 1130 Certified" }
        ],
        status: "approved"
      },
      {
        sku: "KTA-06-PRK",
        name: "Heavy-Duty Chequered Parking & Driveway Tiles",
        brand: supreme.name,
        companyId: supreme._id,
        category: "Kota Stone Specialty",
        subcategory: "Parking Pavers",
        productType: "Paver Tiles",
        price: 68,
        mrp: 95,
        stock: 5000,
        image: "/assets/kota-stone/Parking-Tiles-2.jpg",
        images: [
          { url: "/assets/kota-stone/Parking-Tiles-2.jpg", alt: "Angle 1 (Heavy Vehicle Anti-Skid Pattern)", isPrimary: true },
          { url: "/assets/kota-stone/Parking-Tiles-3.jpg", alt: "Angle 2 (Ramp & Driveway Paver)" },
          { url: "/assets/kota-stone/kota-stone-flooring-4.jpg", alt: "Angle 3 (Rugged Split Base)" },
          { url: "/assets/kota-stone/blue-kota-stone-8.jpg", alt: "Angle 4 (Quarry Dressed Stone)" }
        ],
        shortDescription: "High-traction chequered limestone pavers designed to support heavy vehicular traffic and steep ramps.",
        description: "High-traction chequered limestone pavers designed to support heavy vehicular traffic, steep basement ramps, and rainy pedestrian corridors.",
        technicalSpecifications: [
          { key: "Load Capacity", value: "40 Tonnes / Truck Safe" },
          { key: "Pattern", value: "Diamond & Chequered Grip" },
          { key: "Weather Resistance", value: "100% Frost & Water Safe" }
        ],
        status: "approved"
      },

      // ----------------------------------------------------
      // 🏜️ SAND STONE SPECIALTY
      // ----------------------------------------------------
      {
        sku: "SND-01-AGR",
        name: "Royal Agra Red Sandstone Sandblasted Slabs",
        brand: royalSandstone.name,
        companyId: royalSandstone._id,
        category: "Sand Stone Specialty",
        subcategory: "Architectural Slabs",
        productType: "Red Sandstone",
        price: 135,
        mrp: 190,
        stock: 3500,
        image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        images: [
          { url: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg", alt: "Angle 1 (Sandblasted Agra Red)", isPrimary: true },
          { url: "/assets/sand-stone/slab1-600x500.jpg", alt: "Angle 2 (Quarry Cut Sawn Slab)" },
          { url: "/assets/sand-stone/IMG-20151210-WA0004-600x600.jpg", alt: "Angle 3 (Natural Texture Detail)" }
        ],
        shortDescription: "Timeless imperial terracotta-red sandstone revered across UNESCO heritage sites and ventilated facades.",
        description: "Timeless imperial terracotta-red sandstone revered across UNESCO heritage sites, temples, and premier modern ventilated facades.",
        technicalSpecifications: [
          { key: "Thickness", value: "25-30 mm Sawn" },
          { key: "Density", value: "2.55 g/cm³" },
          { key: "Standard", value: "ASTM C616 Certified" },
          { key: "Origin", value: "Agra-Dholpur Belt" }
        ],
        status: "approved"
      },
      {
        sku: "SND-02-AUT",
        name: "Autumn Brown Natural Calibrated Sandstone",
        brand: royalSandstone.name,
        companyId: royalSandstone._id,
        category: "Sand Stone Specialty",
        subcategory: "Paving Slabs",
        productType: "Brown Sandstone",
        price: 155,
        mrp: 215,
        stock: 2500,
        image: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
        images: [
          { url: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg", alt: "Angle 1 (Autumn Brown Warm Palette)", isPrimary: true },
          { url: "/assets/sand-stone/istockphoto-1146322748-612x612.jpg", alt: "Angle 2 (Natural Stone Masonry)" },
          { url: "/assets/sand-stone/istockphoto-1166440099-612x612.jpg", alt: "Angle 3 (Warm Earth Swirls)" }
        ],
        shortDescription: "Warm autumnal tones with subtle brown, grey, and ochre blending seamlessly for luxury garden patios.",
        description: "Warm autumnal tones with subtle brown, grey, and ochre blending seamlessly for luxury garden patios, terraces, and pool decks.",
        technicalSpecifications: [
          { key: "Finish", value: "Natural Cleft & Tumbled" },
          { key: "Compressive Strength", value: "120 MPa" },
          { key: "Porosity", value: "< 1.2%" }
        ],
        status: "approved"
      },
      {
        sku: "SND-03-MDK",
        name: "Modak Natural Calibrated Sandstone Paving",
        brand: royalSandstone.name,
        companyId: royalSandstone._id,
        category: "Sand Stone Specialty",
        subcategory: "Natural Paving",
        productType: "Exotic Sandstone",
        price: 165,
        mrp: 230,
        stock: 2000,
        image: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg",
        images: [
          { url: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg", alt: "Angle 1 (Modak Rich Terracotta Rose)", isPrimary: true },
          { url: "/assets/sand-stone/istockphoto-1428028931-612x612.jpg", alt: "Angle 2 (Artisanal Texture)" },
          { url: "/assets/sand-stone/istockphoto-1487747252-612x612.jpg", alt: "Angle 3 (Exterior Architectural Facade)" }
        ],
        shortDescription: "Exotic blend of pink, golden, and honey-veined patterns that glow with vibrant luster under sunlight.",
        description: "Exotic blend of pink, golden, and honey-veined patterns that glow with vibrant luster when exposed to direct sunlight.",
        technicalSpecifications: [
          { key: "Color Scheme", value: "Honey Gold & Salmon Pink" },
          { key: "Applications", value: "Patios, Cladding, Pathways" },
          { key: "Water Absorption", value: "0.85%" }
        ],
        status: "approved"
      },
      {
        sku: "SND-04-MNT",
        name: "White Mint Sandstone Shotblasted & Tumbled",
        brand: royalSandstone.name,
        companyId: royalSandstone._id,
        category: "Sand Stone Specialty",
        subcategory: "Mint Sandstone",
        productType: "Pool & Patio Stone",
        price: 185,
        mrp: 260,
        stock: 1800,
        image: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg",
        images: [
          { url: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg", alt: "Angle 1 (Mint Sandstone Shotblasted)", isPrimary: true },
          { url: "/assets/sand-stone/istockphoto-1194350196-612x612.jpg", alt: "Angle 2 (Natural Rockface Texture)" },
          { url: "/assets/sand-stone/istockphoto-2257211262-612x612.jpg", alt: "Angle 3 (Pool Coping & Patio Surface)" }
        ],
        shortDescription: "Clean pale ivory and mint stone with shotblasted textured grip, non-slippery around water bodies.",
        description: "Clean pale ivory and mint stone with shotblasted textured grip, non-slippery around water bodies and thermal insulated under bare feet.",
        technicalSpecifications: [
          { key: "Finish", value: "Shotblasted & Hand-Tumbled" },
          { key: "Frost Resistance", value: "Freeze-Thaw Proven" },
          { key: "Density", value: "2.40 g/cm³" }
        ],
        status: "approved"
      },

      // ----------------------------------------------------
      // 🥻 KOTA DORIA SPECIALTY
      // ----------------------------------------------------
      {
        sku: "KDR-01-ZAR",
        name: "Royal Crimson & Gold Zari Silk-Cotton Saree",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Handloom Sarees",
        productType: "GI Certified Saree",
        price: 4850,
        mrp: 6500,
        stock: 500,
        image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        images: [
          { url: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg", alt: "Angle 1 (Bridal Presentation Saree)", isPrimary: true },
          { url: "/assets/kota-doria/0X2A0415.jpg", alt: "Angle 2 (Pallu & Zari Weave Close-up)" },
          { url: "/assets/kota-doria/3E9A1251.jpg", alt: "Angle 3 (Drape & Sheer Flow)" },
          { url: "/assets/kota-doria/3E9A3098_b15c9d83-4fac-46af-b126-7bb8ad88357d.jpg", alt: "Angle 4 (Full Silhouette Elegance)" }
        ],
        shortDescription: "Authentic handwoven gossamer silk-cotton saree featuring traditional square khat checks and opulent zari border.",
        description: "Authentic handwoven gossamer silk-cotton saree featuring traditional square khat checks, opulent woven zari border, and handcrafted tassels.",
        technicalSpecifications: [
          { key: "Length", value: "6.5 Meters with Blouse Piece" },
          { key: "Khat Density", value: "300+ Checks / Meter" },
          { key: "GI Provenance", value: "GI Tag Certified (Rajasthan)" },
          { key: "Fabric", value: "Pure Silk Warp, Cotton Weft" }
        ],
        status: "approved"
      },
      {
        sku: "KDR-02-BGR",
        name: "Natural Dyed Bagru Hand Block Print Cotton Saree",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Block Print Sarees",
        productType: "Organic Cotton Saree",
        price: 2450,
        mrp: 3200,
        stock: 750,
        image: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
        images: [
          { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg", alt: "Angle 1 (Natural Dyed Bagru Motif)", isPrimary: true },
          { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-754-.jpg", alt: "Angle 2 (Artisanal Woodblock Print Detail)" },
          { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-918.jpg", alt: "Angle 3 (Set Fold & Border View)" },
          { url: "/assets/kota-doria/black-bagh-hand-block-print-natural-dyed-kota-doria-cotton-3pc-572.jpg", alt: "Angle 4 (Black Bagh Natural Dye Variation)" }
        ],
        shortDescription: "Hand-printed using hand-carved teak woodblocks and plant-based vegetable dyes on lightweight Kota Doria cotton.",
        description: "Hand-printed using hand-carved teak woodblocks and plant-based vegetable dyes on lightweight airy Kota Doria cotton fabric.",
        technicalSpecifications: [
          { key: "Dyes", value: "100% Organic Indigo, Harda & Pomegranate" },
          { key: "Craft", value: "Authentic Bagru Hand-Block" },
          { key: "Maintenance", value: "Gentle Cold Hand Wash" }
        ],
        status: "approved"
      },
      {
        sku: "KDR-03-CHK",
        name: "Hand-Embroidered Lucknowi Chikankari Unstitched Suit",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Unstitched Suits",
        productType: "Chikan Needlework",
        price: 2850,
        mrp: 3900,
        stock: 600,
        image: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg",
        images: [
          { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg", alt: "Angle 1 (Chikankari Neckline Embroidery)", isPrimary: true },
          { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-510.jpg", alt: "Angle 2 (Intricate Bakhiya & Phanda Stitches)" },
          { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-910.jpg", alt: "Angle 3 (Kurta Panel & Motifs)" },
          { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-916.jpg", alt: "Angle 4 (Full Unstitched Ensemble)" }
        ],
        shortDescription: "Delicate needlecraft featuring traditional Bakhiya, Tepchi, and Phanda stitches on translucent Kota Doria weave.",
        description: "Delicate needlecraft featuring traditional Bakhiya, Tepchi, and Phanda stitches hand-rendered on translucent Kota Doria weave.",
        technicalSpecifications: [
          { key: "Embroidery", value: "Hand Chikan Needlework" },
          { key: "Set", value: "Kurta & Dupatta Set (2pc)" },
          { key: "Feel", value: "Featherlight Breathable Summer Wear" }
        ],
        status: "approved"
      },
      {
        sku: "KDR-04-BRL",
        name: "Pure Silk-Cotton Kaithun Bridal Saree Ensemble",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Bridal Sarees",
        productType: "Silk-Cotton Ensemble",
        price: 5200,
        mrp: 7200,
        stock: 350,
        image: "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
        images: [
          { url: "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg", alt: "Angle 1 (Bridal Atelier Studio Portrait)", isPrimary: true },
          { url: "/assets/kota-doria/0Q8A6247_62dcd3b8-3f2b-4348-87c0-c6c1437df6b7.jpg", alt: "Angle 2 (Side Silhouette & Drape)" },
          { url: "/assets/kota-doria/0Q8A9127_9a53b013-6806-4ef4-84b9-114c58d9b338.jpg", alt: "Angle 3 (Detail of Pallu & Border)" },
          { url: "/assets/kota-doria/3E9A7095_81bf7953-0d4f-400b-a394-9ddb65bf9205.jpg", alt: "Angle 4 (Full Festive Look)" }
        ],
        shortDescription: "Exquisite handwoven bridal saree featuring lustrous silk finish, reinforced selvedge, and gold floral bootis.",
        description: "Exquisite handwoven bridal saree featuring lustrous silk finish, reinforced selvedge, and intricate gold floral bootis.",
        technicalSpecifications: [
          { key: "Loom", value: "Kaithun Village Pitloom" },
          { key: "Yarn", value: "Mulberry Silk & Long Staple Cotton" },
          { key: "Weight", value: "Under 380 grams" }
        ],
        status: "approved"
      },
      {
        sku: "KDR-05-SNG",
        name: "Sanganeri Hand Block Print 3-Piece Dress Material",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Dress Material",
        productType: "3-Piece Unstitched",
        price: 1950,
        mrp: 2600,
        stock: 800,
        image: "/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg",
        images: [
          { url: "/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg", alt: "Angle 1 (Emerald Green Floral Print)", isPrimary: true },
          { url: "/assets/kota-doria/brown-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-834.jpg", alt: "Angle 2 (Earthy Brown Variant)" },
          { url: "/assets/kota-doria/purple-kota-doria-cotton-hand-block-sanganeri-print-fabric-08-fabrics-876.jpg", alt: "Angle 3 (Royal Purple Floral Details)" },
          { url: "/assets/kota-doria/blue-hand-block-bagh-print-natural-dyed-kota-doria-cotton-3pc-597.jpg", alt: "Angle 4 (Blue Hand Block Print Set)" }
        ],
        shortDescription: "Graceful Rajasthani floral motifs hand-stamped onto breathable square-checked fabric, with matching dupatta.",
        description: "Graceful Rajasthani floral motifs hand-stamped onto breathable square-checked fabric, complete with matching dupatta.",
        technicalSpecifications: [
          { key: "Set Content", value: "Top 2.5m, Bottom 2.0m, Dupatta 2.5m" },
          { key: "Print", value: "Calico Heritage Sanganer" },
          { key: "Colorfastness", value: "Lab Tested Level 4" }
        ],
        status: "approved"
      },
      {
        sku: "KDR-06-DUP",
        name: "Handcrafted Lucknowi Chikankari Pure Cotton Dupatta",
        brand: parampara.name,
        companyId: parampara._id,
        category: "Kota Doria Specialty",
        subcategory: "Dupattas",
        productType: "Pure Cotton Dupatta",
        price: 1450,
        mrp: 1950,
        stock: 900,
        image: "/assets/kota-doria/red-kota-doria-cotton-hand-embroidered-lucknowi-chikankari-dupatta-19-131.jpg",
        images: [
          { url: "/assets/kota-doria/red-kota-doria-cotton-hand-embroidered-lucknowi-chikankari-dupatta-19-131.jpg", alt: "Angle 1 (Ruby Red Embroidered Dupatta)", isPrimary: true },
          { url: "/assets/kota-doria/black-kota-doria-cotton-tie-dye-bandhani-fabric-09-fabrics-496.jpg", alt: "Angle 2 (Bandhani Tie-Dye Fabric)" },
          { url: "/assets/kota-doria/green-kota-doria-cotton-tie-dye-bandhani-fabric-11-fabrics-863.jpg", alt: "Angle 3 (Olive Green Bandhani)" },
          { url: "/assets/kota-doria/yellow-plain-cotton-kota-doria-fabric-11-fabrics-859.jpg", alt: "Angle 4 (Mustard Yellow Plain Fabric)" }
        ],
        shortDescription: "Festive ruby red sheer dupatta ornamented with white silk thread embroidery and handcrafted border finish.",
        description: "Festive ruby red sheer dupatta ornamented with white silk thread embroidery and handcrafted border finish.",
        technicalSpecifications: [
          { key: "Dimensions", value: "2.5m x 36 Inches" },
          { key: "Weight", value: "95 grams" },
          { key: "Border", value: "Hand-rolled Picot / Zari piping" }
        ],
        status: "approved"
      },

      // ----------------------------------------------------
      // 📱 AI PRODUCT STUDIO PHONE SHOTS & LIFESTYLE DEMOS
      // ----------------------------------------------------
      {
        sku: "DEMO-WATCH-01",
        name: "Luxury Chronograph Precision Watch",
        brand: techStudio.name,
        companyId: techStudio._id,
        category: "Accessories",
        subcategory: "Watches",
        productType: "Chronograph Watch",
        price: 14999,
        mrp: 22999,
        stock: 50,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80",
        shortDescription: "Surgical-grade stainless steel chronograph with sapphire crystal and Japanese automatic movement.",
        description: "Surgical-grade 316L stainless steel chronograph with scratch-resistant sapphire crystal glass, 100m water resistance, and Japanese automatic caliber.",
        technicalSpecifications: [
          { key: "Case Diameter", value: "42mm" },
          { key: "Movement", value: "Automatic Caliber" },
          { key: "Glass", value: "Sapphire Crystal" }
        ],
        status: "approved"
      },
      {
        sku: "DEMO-SNEAKER-02",
        name: "Performance CloudGlide Running Sneaker",
        brand: techStudio.name,
        companyId: techStudio._id,
        category: "Footwear",
        subcategory: "Sneakers",
        productType: "Running Shoes",
        price: 5499,
        mrp: 8999,
        stock: 120,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80",
        shortDescription: "Ultra-responsive nitrogen-infused foam midsole with breathable circular knit upper.",
        description: "Engineered for maximum energy return and marathon durability. Seamless ergonomic knit upper with dynamic carbon propulsion plate.",
        technicalSpecifications: [
          { key: "Cushioning", value: "Nitrogen Foam" },
          { key: "Drop", value: "8mm" },
          { key: "Weight", value: "215g" }
        ],
        status: "approved"
      },
      {
        sku: "DEMO-SERUM-03",
        name: "Bio-Active Vitamin C Radiance Serum",
        brand: techStudio.name,
        companyId: techStudio._id,
        category: "Beauty",
        subcategory: "Skincare",
        productType: "Face Serum",
        price: 1850,
        mrp: 2450,
        stock: 300,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&fit=crop&q=80",
        shortDescription: "Clinical-grade 15% Ethyl Ascorbic Acid with Hyaluronic Acid and Ferulic booster.",
        description: "Potent brightening and antioxidant serum that visibly diminishes dark spots, hyperpigmentation, and promotes collagen synthesis.",
        technicalSpecifications: [
          { key: "Volume", value: "30ml" },
          { key: "Active Ingredients", value: "15% Vit C + 1% Ferulic Acid" },
          { key: "Skin Type", value: "All Skin Types" }
        ],
        status: "approved"
      },
      {
        sku: "APX-TECH-NC100",
        name: "ai SonicWave Pro Wireless ANC Headphones - Matte Onyx Edition",
        brand: techStudio.name,
        companyId: techStudio._id,
        category: "Electronics",
        subcategory: "Audio & Headphones",
        productType: "Over-Ear Headphones",
        price: 6499,
        mrp: 11999,
        stock: 85,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        images: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", isPrimary: true },
          { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80", isPrimary: false }
        ],
        shortDescription: "Flagship active noise-cancelling headphones featuring 40mm beryllium drivers and 45-hour battery.",
        description: "Immerse yourself in studio-grade acoustics with the ai SonicWave Pro. Engineered with hybrid active noise cancellation, these headphones eliminate up to 98% of ambient noise.",
        technicalSpecifications: [
          { key: "Driver Size", value: "40mm Beryllium" },
          { key: "Battery Life", value: "45 Hours (ANC On)" },
          { key: "Bluetooth", value: "5.3 LE" },
          { key: "Weight", value: "250g" }
        ],
        status: "approved"
      },
      {
        sku: "APX-FASH-TEE88",
        name: "ai AeroKnit 100% Organic Supima Cotton Relaxed Fit T-Shirt",
        brand: techStudio.name,
        companyId: techStudio._id,
        category: "Fashion",
        subcategory: "Men's Apparel",
        productType: "T-Shirt",
        price: 1299,
        mrp: 2499,
        stock: 220,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
        shortDescription: "Ultra-heavyweight 240 GSM organic Supima cotton t-shirt with relaxed streetwear drape.",
        description: "Redefine your everyday wardrobe with the ai AeroKnit Relaxed Tee. Tailored from 100% certified long-staple Supima cotton.",
        technicalSpecifications: [
          { key: "Fabric", value: "100% Supima Organic Cotton" },
          { key: "Weight", value: "240 GSM" },
          { key: "Fit", value: "Relaxed Boxy Streetwear" }
        ],
        status: "approved"
      }
    ];

    for (const p of productsToSeed) {
      let existing = await CatalogueProduct.findOne({ organizationId: org._id, sku: p.sku });
      if (!existing) {
        existing = await CatalogueProduct.create({ ...p, organizationId: org._id });
        console.log(`  ➕ Created Product: [${p.sku}] ${p.name}`);
      } else {
        Object.assign(existing, p);
        await existing.save();
        console.log(`  🔄 Updated Product: [${p.sku}] ${p.name}`);
      }
    }

    // 4. Pre-saved Dynamic Catalogue Studio Records (ODOP / Studio Database)
    console.log("\n📑 Seeding Pre-configured Dynamic Catalogue Records...");
    const dynamicRecordsToSeed = [
      {
        ent_name: "Supreme Granite & Stones",
        companyId: supreme._id,
        district: "Kota & Bangalore",
        product: "Kota Stone Architectural Catalogue",
        template_uid: "editorial:ed-ks1",
        color: "#4E5C43",
        status: "final",
        form_json: {
          tagline: "Natural • Durable • Architectural Precision Slabs",
          why: [
            "Quarry direct extraction ensuring authentic Kota blue-green limestone shade",
            "Computerized 12-head calibration to ±1mm thickness uniformity",
            "Naturally non-slip R11 surface rating ideal for wet footpaths and hospitals"
          ],
          apps: [
            "Luxury Residential Flooring & Verandas",
            "Hospital & High-Traffic Public Corridors",
            "Exterior Paving, Stepping Stones & Swimming Pool Decks"
          ],
          values: [
            ["Compressive Strength", "135-140 MPa"],
            ["Water Absorption", "< 0.38% (Virtually Impermeable)"],
            ["Finish Types", "Natural, Mirror Polish, Honed, Leather"]
          ]
        },
        logo_file: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg"
      },
      {
        ent_name: "Parampara Threads",
        companyId: parampara._id,
        district: "Kaithun, Kota",
        product: "Kota Doria Handloom Royal Atelier",
        template_uid: "editorial:ed-kd1",
        color: "#7c2d12",
        status: "final",
        form_json: {
          tagline: "Royal Gossamer Handlooms • GI Tagged Atelier",
          why: [
            "Centuries-old pitloom craftsmanship preserved by certified artisan clusters",
            "Signature square khat weaving pattern with 300+ checks per linear meter",
            "Lightweight breathable pure silk warp and fine Egyptian cotton weft"
          ],
          apps: [
            "Luxury Bridal & Festive Trousseau",
            "Designer Runway & Lookbook Ensembles",
            "Summer Daytime Elegance & Heritage Drape"
          ],
          values: [
            ["Provenance", "GI Tag Certified No. 37 (Rajasthan)"],
            ["Weave Structure", "Silk Warp / Cotton Weft Pitloom"],
            ["Weight", "Featherlight under 380 grams per saree"]
          ]
        },
        logo_file: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg"
      },
      {
        ent_name: "Malwa Agro Fresh & Garlic Exports",
        companyId: malwaGarlic._id,
        district: "Mandsaur & Kota Agri Corridor",
        product: "Grade-A Sun-Cured Garlic Wholesale Catalogue",
        template_uid: "editorial:ed-g1",
        color: "#1b4332",
        status: "final",
        form_json: {
          tagline: "Sun-Cured Grade-A White Garlic • Direct Malwa Farm Collective",
          why: [
            "Direct procurement from certified pesticide-free farmer collectives",
            "Mechanical sorting guarantee for 50-65mm export caliber sizing",
            "Air-peeled automated packaging with zero chlorine or bleach washing"
          ],
          apps: [
            "International Reefer Sea Cargo Export",
            "Commercial Kitchens & Food Processing Plants",
            "Wholesale Mandi & Supermarket Fresh produce Distribution"
          ],
          values: [
            ["Moisture Content", "< 64% Guaranteed Ambient Stable"],
            ["Allicin Index", "High Potency Standard Lab Certified"],
            ["Packaging", "10kg/20kg Leno Mesh Bags & Corrugated Boxes"]
          ]
        },
        logo_file: "/assets/garlic/garlic-01.jpeg"
      },
      {
        ent_name: "Royal Heritage Sandstones",
        companyId: royalSandstone._id,
        district: "Jodhpur & Agra",
        product: "Imperial Sandstone Facade & Cladding Catalogue",
        template_uid: "editorial:ed-s1",
        color: "#b45309",
        status: "final",
        form_json: {
          tagline: "Palatial Jodhpur & Agra Red Sandstones",
          why: [
            "Timeless stone used across UNESCO heritage forts and modern embassies",
            "Superior thermal insulation that shields buildings from scorching summer heat",
            "Exceptional workability for intricate CNC jali screens and hand carvings"
          ],
          apps: [
            "Exterior Ventilated Rainscreen Facades",
            "Monumental Temples, Resorts & Palaces",
            "Landscape Paving, Garden Steps & Pool Coping"
          ],
          values: [
            ["Standard", "ASTM C616 Dimension Stone Certified"],
            ["Density", "2.55 g/cm³ High Compressive Strength"],
            ["Surface Finishes", "Sandblasted, Shotblasted, Rockface, Honed"]
          ]
        },
        logo_file: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg"
      }
    ];

    for (const rec of dynamicRecordsToSeed) {
      let existing = await CatalogueRecord.findOne({ organizationId: org._id, ent_name: rec.ent_name });
      if (!existing) {
        await CatalogueRecord.create({ ...rec, organizationId: org._id });
        console.log(`  ➕ Created Catalogue Record: "${rec.ent_name}"`);
      } else {
        Object.assign(existing, rec);
        await existing.save();
        console.log(`  🔄 Updated Catalogue Record: "${rec.ent_name}"`);
      }
    }

    // 5. Sync to Legacy Storefront Product Collection (for backward compatibility)
    console.log("\n🛒 Syncing to Legacy Storefront Product Collection...");
    const legacyProductsToSeed = [
      {
        name: "Kota Stone Natural Blue Calibrated Tiles",
        description: "Fine-grained architectural limestone with natural slip resistance and calibrated 18-20mm thickness.",
        price: 85,
        category: "Home",
        brand: "Supreme Granite & Stones",
        image: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
        stock: 6000,
        rating: 4.8
      },
      {
        name: "Royal Crimson & Gold Zari Silk-Cotton Saree",
        description: "Authentic handwoven gossamer silk-cotton saree with square khat checks and opulent zari border.",
        price: 4850,
        category: "Fashion",
        brand: "Parampara Threads",
        image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
        stock: 500,
        rating: 4.9
      },
      {
        name: "Royal Agra Red Sandstone Sandblasted Slabs",
        description: "Imperial terracotta-red sandstone revered across heritage architecture and modern facades.",
        price: 135,
        category: "Home",
        brand: "Royal Heritage Sandstones",
        image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
        stock: 3500,
        rating: 4.7
      },
      {
        name: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
        description: "Sun-cured large caliber garlic bulbs from Malwa soil with papery white skins and rich aromatic allicin.",
        price: 180,
        category: "Home",
        brand: "Malwa Agro Fresh & Garlic Exports",
        image: "/assets/garlic/garlic-01.jpeg",
        stock: 12000,
        rating: 4.9
      },
      {
        name: "ai SonicWave Pro Wireless ANC Headphones",
        description: "Flagship active noise-cancelling headphones featuring 40mm beryllium drivers and 45-hour battery.",
        price: 6499,
        category: "Electronics",
        brand: "ai Studio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        stock: 85,
        rating: 4.9
      }
    ];

    for (const lp of legacyProductsToSeed) {
      let existing = await Product.findOne({ name: lp.name });
      if (!existing) {
        await Product.create(lp);
        console.log(`  ➕ Created Legacy Product: "${lp.name}"`);
      } else {
        Object.assign(existing, lp);
        await existing.save();
        console.log(`  🔄 Updated Legacy Product: "${lp.name}"`);
      }
    }

    console.log("\n✨ Master database seeding completed successfully!");
    console.log("📊 Summary:");
    const [compCount, prodCount, recCount, legacyCount] = await Promise.all([
      Company.countDocuments({ organizationId: org._id }),
      CatalogueProduct.countDocuments({ organizationId: org._id }),
      CatalogueRecord.countDocuments({ organizationId: org._id }),
      Product.countDocuments()
    ]);
    console.log(`  • Companies in DB: ${compCount}`);
    console.log(`  • Catalogue Products in DB: ${prodCount}`);
    console.log(`  • Dynamic Catalogue Records in DB: ${recCount}`);
    console.log(`  • Legacy Storefront Products in DB: ${legacyCount}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  }
};

seedDatabase();

