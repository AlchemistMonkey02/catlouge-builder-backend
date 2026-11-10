require("dotenv").config();
const connectDB = require("./config/db");
const Company = require("./models/Company");
const CatalogueProduct = require("./models/CatalogueProduct");
const { getDefaultOrganization } = require("./middleware/authMiddleware");

const run = async () => {
  await connectDB();
  const org = await getDefaultOrganization();
  console.log("Connected to MongoDB Atlas!");

  // 1. SUPREME GRANITE & STONES (Kota Stone)
  let supreme = await Company.findOne({ organizationId: org._id, name: "Supreme Granite & Stones" });
  if (!supreme) {
    supreme = await Company.create({
      organizationId: org._id,
      name: "Supreme Granite & Stones",
      tagline: "Natural • Durable • Timeless Architectural Stone",
      industry: "Granite & Kota Stone",
      logoUrl: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
      brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
      contact: {
        email: "sales@supremestones.in",
        phone: "+91 9066804666",
        website: "https://www.supremestones.in",
        address: "15 16-1A, 21st Mile Stone, Jigani Industrial Area, Bangalore – 560083",
      },
      legal: { gstNumber: "29AAGCS1234F1Z9", currency: "INR" },
      wholesaleTerms: "Nationwide delivery. Calibrated 20mm box packing.",
      isDefault: true,
    });
    console.log("Created Supreme Granite & Stones");
  } else {
    supreme.logoUrl = "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg";
    await supreme.save();
  }

  // 2. PARAMPARA THREADS & ATELIER (Kota Doria)
  let parampara = await Company.findOne({ organizationId: org._id, name: "Parampara Threads" });
  const paramparaData = {
    organizationId: org._id,
    name: "Parampara Threads",
    tagline: "Royal Gossamer Handlooms • GI Tagged Atelier",
    industry: "Kota Doria Handlooms & Sarees",
    district: "Kota, Rajasthan",
    state: "Rajasthan",
    odopProduct: "Kota Doria Handlooms",
    whatsappNumber: "+91 94141 23456",
    giTagNumber: "GI Tag Reg. No. 37",
    udyamNumber: "UDYAM-RJ-20-0012345",
    logoUrl: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
    brandColors: { primary: "#7c2d12", secondary: "#431407", accent: "#d97706" },
    contact: {
      email: "orders@paramparathreads.com",
      phone: "+91 9414123456",
      website: "https://www.paramparathreads.com",
      address: "Weavers Colony, Kaithun, Kota, Rajasthan – 325001",
    },
    qrLinks: {
      businessProfile: "https://www.paramparathreads.com/catalogue",
      whatsapp: "https://wa.me/919414123456",
      website: "https://www.paramparathreads.com",
      location: "https://maps.google.com/?q=Kaithun+Kota+Rajasthan",
      instagram: "https://instagram.com/paramparathreads",
      custom: "",
      customLabel: "Scan for GI Provenance",
    },
    legal: { gstNumber: "08AAGCP9876K1Z2", currency: "INR" },
    wholesaleTerms: "Minimum wholesale order: 10 pieces. Certified authentic GI Tag No. 37.",
    isDefault: false,
  };

  if (!parampara) {
    parampara = await Company.create(paramparaData);
    console.log("Created Parampara Threads");
  } else {
    Object.assign(parampara, paramparaData);
    await parampara.save();
  }

  // 3. ROYAL HERITAGE SANDSTONES (Sand Stone)
  let royalSandstone = await Company.findOne({ organizationId: org._id, name: "Royal Heritage Sandstones" });
  if (!royalSandstone) {
    royalSandstone = await Company.create({
      organizationId: org._id,
      name: "Royal Heritage Sandstones",
      tagline: "Palatial Jodhpur & Agra Red Sandstones",
      industry: "Sandstone Facades & Landscaping",
      logoUrl: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
      brandColors: { primary: "#b45309", secondary: "#451a03", accent: "#f59e0b" },
      contact: {
        email: "export@royalsandstone.in",
        phone: "+91 9829054321",
        website: "https://www.royalsandstone.in",
        address: "Mandore Stone Industrial Zone, Jodhpur, Rajasthan – 342007",
      },
      legal: { gstNumber: "08AAGCR5432M1Z5", currency: "INR" },
      wholesaleTerms: "International sea container payload. ASTM C616 standard certified.",
      isDefault: false,
    });
    console.log("Created Royal Heritage Sandstones");
  } else {
    royalSandstone.logoUrl = "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg";
    await royalSandstone.save();
  }

  // 4. MALWA AGRO FRESH & GARLIC EXPORTS (Garlic Specialty)
  let malwaGarlic = await Company.findOne({ organizationId: org._id, name: "Malwa Agro Fresh & Garlic Exports" });
  if (!malwaGarlic) {
    malwaGarlic = await Company.create({
      organizationId: org._id,
      name: "Malwa Agro Fresh & Garlic Exports",
      tagline: "Sun-Cured Grade-A White Garlic • Direct Malwa Farm Collective",
      industry: "Garlic Specialty & Agri Commodity",
      logoUrl: "/assets/garlic/garlic-01.jpeg",
      brandColors: { primary: "#2d6a4f", secondary: "#1b4332", accent: "#d97706" },
      contact: {
        email: "procurement@malwagarlic.in",
        phone: "+91 9752109876",
        website: "https://www.malwagarlic.in",
        address: "Krishi Upaj Mandi Yard, Mandsaur - Kota Agro Corridor, MP/Rajasthan – 458001",
      },
      legal: { gstNumber: "23AAGCM4321P1Z8", currency: "INR" },
      wholesaleTerms: "20ft/40ft Reefer container & ventilated mesh bags. Phytosanitary & Global GAP certified.",
      isDefault: false,
    });
    console.log("Created Malwa Agro Fresh & Garlic Exports");
  } else {
    malwaGarlic.logoUrl = "/assets/garlic/garlic-01.jpeg";
    await malwaGarlic.save();
  }

  const allProducts = [
    // --- KOTA STONE ---
    {
      sku: "KS-BLU-01",
      name: "Kota Stone Natural Blue Calibrated Tiles",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Kota Stone",
      price: 85,
      mrp: 120,
      stock: 6000,
      image: "/assets/kota-stone/Blue-Kota-Stone-Tiles-1.jpg",
      shortDescription: "Fine-grained architectural limestone with natural slip resistance and calibrated 18-20mm thickness.",
      description: "Fine-grained architectural limestone from Kota quarries with uniform blue coloration, machine gauged thickness, and R11 anti-skid wet grip.",
      technicalSpecifications: [
        { key: "Thickness", value: "18-20 mm Calibrated" },
        { key: "Compressive Strength", value: "135-140 MPa" },
        { key: "Water Absorption", value: "< 0.38%" },
        { key: "Finish", value: "Natural Non-Slip / Sawn Edge" }
      ],
      status: "approved"
    },
    {
      sku: "KS-MIR-02",
      name: "Mirror High-Polish Kota Stone Slabs",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Kota Stone",
      price: 110,
      mrp: 155,
      stock: 4500,
      image: "/assets/kota-stone/KOTASTONEHIGH-POLISH8442.jpg",
      shortDescription: "High-reflectivity mirror polish finish highlighting natural blue-green mineral luster.",
      description: "12-head computerized mirror polish finish that reveals the magnificent natural cyan-green limestone grain for high-traffic luxury lobbies.",
      technicalSpecifications: [
        { key: "Finish", value: "12-Head Mirror Polish" },
        { key: "Sizes", value: "600x600, 600x900 mm" },
        { key: "Density", value: "2.68 g/cm³" }
      ],
      status: "approved"
    },
    {
      sku: "KS-DSG-03",
      name: "Designer Architectural Kota Stone Cuts",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Kota Stone",
      price: 95,
      mrp: 140,
      stock: 3500,
      image: "/assets/kota-stone/Designer-Kota-Stone-Tiles.jpg",
      shortDescription: "Geometric pattern paving tiles and ornamental floor accents for villas and heritage verandas.",
      description: "Custom geometric paving tiles and ornamental architectural accents designed for luxury resort terraces, courtyards, and grand verandas.",
      technicalSpecifications: [
        { key: "Finish", value: "Honed Satin / Leather" },
        { key: "Application", value: "Courtyard & Landscape" }
      ],
      status: "approved"
    },
    {
      sku: "KS-YEL-04",
      name: "Natural Yellow Kota Limestone Tiles",
      brand: "Supreme Granite & Stones",
      companyId: supreme._id,
      organizationId: org._id,
      category: "Kota Stone",
      price: 90,
      mrp: 135,
      stock: 4000,
      image: "/assets/kota-stone/Yellow-Kota-Stone-Tiles.jpg",
      shortDescription: "Warm earth-toned yellow limestone tiles, naturally heat resistant and cool under bare feet.",
      description: "Naturally layered warm earth-tone limestone tiles displaying golden undertones, naturally cool to the touch and thermal-resistant.",
      technicalSpecifications: [
        { key: "Tone", value: "Desert Gold & Warm Ochre" },
        { key: "Thickness", value: "18 - 20 mm" }
      ],
      status: "approved"
    },

    // --- KOTA DORIA ---
    {
      sku: "KD-ZAR-01",
      name: "Royal Crimson & Gold Zari Silk-Cotton Saree",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 4850,
      mrp: 6500,
      priceRange: "₹4,850 – ₹6,500",
      moq: "10 Pieces (Wholesale)",
      size: "6.5m (Includes 80cm Running Blouse Piece)",
      material: "70% Mulberry Silk, 30% Fine Mallow Cotton",
      materialComposition: "70% Mulberry Silk, 30% Fine Mallow Cotton",
      finish: "Tested Electro-Gold Zari on Square Khat",
      application: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
      useApplication: "Bridal Ensembles, Wedding Drapes & High-End Boutique Luxury",
      verifiedCopy: true,
      stock: 500,
      image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
      shortDescription: "Handwoven gossamer silk-cotton saree with authentic square khat checks and opulent zari border.",
      description: "Authentic handwoven gossamer silk-cotton saree featuring traditional square khat checks, opulent woven zari border, and handcrafted tassels.",
      technicalSpecifications: [
        { key: "Length", value: "6.5 Meters with Blouse Piece" },
        { key: "Khat Density", value: "300+ Checks / Meter" },
        { key: "Provenance", value: "GI Tag Certified (Rajasthan)" }
      ],
      status: "approved"
    },
    {
      sku: "KD-BGR-02",
      name: "Natural Dyed Bagru Hand Block Print Cotton Saree",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 2450,
      mrp: 3200,
      priceRange: "₹2,450 – ₹3,200",
      moq: "15 Pieces (Wholesale)",
      size: "6.3m (Complete with Blouse Piece)",
      material: "100% Breathable Kota Doria Cotton",
      materialComposition: "100% Breathable Kota Doria Cotton",
      finish: "Hand-Carved Teakwood Block Stamp & Natural Indigo",
      application: "Daytime Festive Wear, Designer Boutiques & Summer Elegance",
      useApplication: "Daytime Festive Wear, Designer Boutiques & Summer Elegance",
      verifiedCopy: true,
      stock: 750,
      image: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
      shortDescription: "Hand-printed using hand-carved teak woodblocks and plant-based vegetable dyes.",
      description: "Hand-printed using hand-carved teak woodblocks and plant-based vegetable dyes on lightweight airy Kota Doria cotton fabric.",
      technicalSpecifications: [
        { key: "Dyes", value: "100% Organic Indigo & Pomegranate" },
        { key: "Craft", value: "Bagru Hand-Block" }
      ],
      status: "approved"
    },
    {
      sku: "KD-CHK-03",
      name: "Hand-Embroidered Lucknowi Chikankari Unstitched Suit",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 2850,
      mrp: 3900,
      priceRange: "₹2,850 – ₹3,900",
      moq: "10 Sets (Wholesale)",
      size: "Top 2.5m, Bottom 2.0m, Dupatta 2.5m",
      material: "Pure Cotton Kota Doria Weave",
      materialComposition: "Pure Cotton Kota Doria Weave",
      finish: "Artisanal Bakhiya & Phanda Needlework",
      application: "Boutique Tailoring, Festive Gatherings & Formal Ethnic Wear",
      useApplication: "Boutique Tailoring, Festive Gatherings & Formal Ethnic Wear",
      verifiedCopy: true,
      stock: 600,
      image: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg",
      shortDescription: "Intricate needlework featuring traditional Bakhiya and Phanda stitches on translucent weave.",
      description: "Delicate needlecraft featuring traditional Bakhiya, Tepchi, and Phanda stitches hand-rendered on translucent Kota Doria weave.",
      technicalSpecifications: [
        { key: "Embroidery", value: "Hand Chikan Needlework" },
        { key: "Set", value: "Kurta & Dupatta Set (2pc)" }
      ],
      status: "approved"
    },
    {
      sku: "KD-BRL-04",
      name: "Pure Silk-Cotton Kaithun Bridal Saree Ensemble",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 5200,
      mrp: 7200,
      priceRange: "₹5,200 – ₹7,200",
      moq: "5 Pieces (Artisan Order)",
      size: "6.5m (Includes 80cm Brocade Blouse Piece)",
      material: "Pure Mulberry Silk Warp, Long-Staple Cotton Weft",
      materialComposition: "Pure Mulberry Silk Warp, Long-Staple Cotton Weft",
      finish: "Heavy Tested Zari Pallu with Reinforced Selvedge",
      application: "Bridal Trousseau, Royal Wedding Banquets & Couture Lookbooks",
      useApplication: "Bridal Trousseau, Royal Wedding Banquets & Couture Lookbooks",
      verifiedCopy: true,
      stock: 350,
      image: "/assets/kota-doria/0Q8A3880_97438f9f-513a-428a-99a4-3952c7ce0619.jpg",
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
      sku: "KD-SNG-05",
      name: "Sanganeri Hand Block Print 3-Piece Dress Material",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 1950,
      mrp: 2600,
      priceRange: "₹1,950 – ₹2,600",
      moq: "15 Sets (Wholesale)",
      size: "Top 2.5m, Bottom 2.0m, Dupatta 2.5m",
      material: "100% Breathable Kota Doria Cotton",
      materialComposition: "100% Breathable Kota Doria Cotton",
      finish: "Calico Heritage Sanganer Hand Block",
      application: "Everyday Luxury, Office Ethnic Attire & Boutique Retailing",
      useApplication: "Everyday Luxury, Office Ethnic Attire & Boutique Retailing",
      verifiedCopy: true,
      stock: 800,
      image: "/assets/kota-doria/green-kota-doria-cotton-hand-block-sanganeri-print-3pc-unstitched-858.jpg",
      shortDescription: "Graceful Rajasthani floral motifs hand-stamped onto breathable square-checked fabric, with matching dupatta.",
      description: "Graceful Rajasthani floral motifs hand-stamped onto breathable square-checked fabric, complete with matching dupatta.",
      technicalSpecifications: [
        { key: "Set Content", value: "Top 2.5m, Bottom 2.0m, Dupatta 2.5m" },
        { key: "Print", value: "Calico Heritage Sanganer" }
      ],
      status: "approved"
    },
    {
      sku: "KD-DUP-06",
      name: "Handcrafted Lucknowi Chikankari Pure Cotton Dupatta",
      brand: "Parampara Threads",
      companyId: parampara._id,
      organizationId: org._id,
      category: "Kota Doria",
      price: 1450,
      mrp: 1950,
      priceRange: "₹1,450 – ₹1,950",
      moq: "20 Pieces (Wholesale)",
      size: "2.5m Length x 36 Inches Width",
      material: "Pure Cotton-Silk Kota Doria Weave",
      materialComposition: "Pure Cotton-Silk Kota Doria Weave",
      finish: "White Silk Thread Embroidery & Tassels",
      application: "Layering over Festive Kurtas, Lehengas & Fusion Ensembles",
      useApplication: "Layering over Festive Kurtas, Lehengas & Fusion Ensembles",
      verifiedCopy: true,
      stock: 900,
      image: "/assets/kota-doria/red-kota-doria-cotton-hand-embroidered-lucknowi-chikankari-dupatta-19-131.jpg",
      shortDescription: "Festive ruby red sheer dupatta ornamented with white silk thread embroidery and handcrafted border finish.",
      description: "Festive ruby red sheer dupatta ornamented with white silk thread embroidery and handcrafted border finish.",
      technicalSpecifications: [
        { key: "Dimensions", value: "2.5m x 36 Inches" },
        { key: "Weight", value: "95 grams" }
      ],
      status: "approved"
    },

    // --- SAND STONE ---
    {
      sku: "SS-AGR-01",
      name: "Royal Agra Red Sandstone Sandblasted Slabs",
      brand: "Royal Heritage Sandstones",
      companyId: royalSandstone._id,
      organizationId: org._id,
      category: "Sand Stone",
      price: 135,
      mrp: 190,
      stock: 3500,
      image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
      shortDescription: "Imperial terracotta-red sandstone revered across heritage architecture and modern facades.",
      description: "Timeless imperial terracotta-red sandstone revered across UNESCO heritage sites, temples, and premier modern ventilated facades.",
      technicalSpecifications: [
        { key: "Thickness", value: "25-30 mm Sawn" },
        { key: "Standard", value: "ASTM C616 Certified" },
        { key: "Density", value: "2.55 g/cm³" }
      ],
      status: "approved"
    },
    {
      sku: "SS-AUT-02",
      name: "Autumn Brown Natural Sandstone Slabs",
      brand: "Royal Heritage Sandstones",
      companyId: royalSandstone._id,
      organizationId: org._id,
      category: "Sand Stone",
      price: 155,
      mrp: 215,
      stock: 2500,
      image: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg",
      shortDescription: "Warm autumnal tones with subtle brown and grey blending for patios, terraces, and pool decks.",
      description: "Warm autumnal tones with subtle brown, grey, and ochre blending seamlessly for luxury garden patios, terraces, and pool decks.",
      technicalSpecifications: [
        { key: "Finish", value: "Natural Cleft & Tumbled" },
        { key: "Compressive Strength", value: "120 MPa" }
      ],
      status: "approved"
    },
    {
      sku: "SS-MDK-03",
      name: "Modak Natural Calibrated Sandstone Paving",
      brand: "Royal Heritage Sandstones",
      companyId: royalSandstone._id,
      organizationId: org._id,
      category: "Sand Stone",
      price: 165,
      mrp: 230,
      stock: 2000,
      image: "/assets/sand-stone/MODAK-Sandstone-Thumbnail-1-1024x1024.jpg",
      shortDescription: "Exotic blend of pink, golden, and honey-veined patterns that glow with vibrant luster.",
      description: "Exotic blend of pink, golden, and honey-veined patterns that glow with vibrant luster when exposed to direct sunlight.",
      technicalSpecifications: [
        { key: "Color", value: "Honey Gold & Salmon Pink" },
        { key: "Water Absorption", value: "0.85%" }
      ],
      status: "approved"
    },
    {
      sku: "SS-MNT-04",
      name: "White Mint Sandstone Shotblasted & Tumbled",
      brand: "Royal Heritage Sandstones",
      companyId: royalSandstone._id,
      organizationId: org._id,
      category: "Sand Stone",
      price: 185,
      mrp: 260,
      stock: 1800,
      image: "/assets/sand-stone/White-Mint-Sandstone-Shotblasted-Tumbled-1024x768.jpg",
      shortDescription: "Pale ivory and mint stone with shotblasted grip, non-slippery around pool copings.",
      description: "Clean pale ivory and mint stone with shotblasted textured grip, non-slippery around water bodies and thermal insulated under bare feet.",
      technicalSpecifications: [
        { key: "Finish", value: "Shotblasted & Hand-Tumbled" },
        { key: "Frost Resistance", value: "Freeze-Thaw Proven" }
      ],
      status: "approved"
    },
    // --- GARLIC SPECIALTY ---
    {
      sku: "GRL-EXP-01",
      name: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
      brand: "Malwa Agro Fresh & Garlic Exports",
      companyId: malwaGarlic._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      price: 180,
      mrp: 240,
      stock: 12000,
      image: "/assets/garlic/garlic-01.jpeg",
      shortDescription: "Sun-cured large caliber garlic bulbs from Malwa soil with papery white skins and rich aromatic allicin.",
      description: "Direct farm procurement featuring high allicin pungency, pesticide-free soil cultivation, and strict multi-stage mechanical caliber sorting (50-65mm).",
      technicalSpecifications: [
        { key: "Bulb Caliber", value: "50-65 mm" },
        { key: "Moisture Content", value: "< 64% Max" },
        { key: "Packing", value: "10/20kg Ventilated Red Mesh Bags" },
        { key: "Certification", value: "Global GAP & APEDA Phytosanitary" }
      ],
      status: "approved"
    },
    {
      sku: "GRL-PEL-02",
      name: "Fresh Peeled Whole Garlic Cloves",
      brand: "Malwa Agro Fresh & Garlic Exports",
      companyId: malwaGarlic._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      price: 260,
      mrp: 320,
      stock: 4500,
      image: "/assets/garlic/garlic-05.jpeg",
      shortDescription: "Air-peeled nitrogen-flushed whole garlic cloves, 100% kitchen yield ready with zero peeling prep.",
      description: "Peeled in clean-room automated facilities, preserving volatile garlic oils and allicin without water soaking or bleach.",
      technicalSpecifications: [
        { key: "Purity", value: "100% Sorted Whole Cloves" },
        { key: "Shelf Life", value: "45 Days at 0-4°C" },
        { key: "Packaging", value: "1kg Vacuum Pouches / 10kg Master Carton" }
      ],
      status: "approved"
    },
    {
      sku: "GRL-BLK-03",
      name: "Bulk Harvest Agro-Grade Garlic Sacks",
      brand: "Malwa Agro Fresh & Garlic Exports",
      companyId: malwaGarlic._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      price: 340,
      mrp: 420,
      stock: 25000,
      image: "/assets/garlic/garlic-08.jpeg",
      shortDescription: "Field-fresh sun-cured garlic in ventilated export mesh bags, calibrated for wholesale mandis.",
      description: "Heavy wholesale commodity lots, dried on raised slatted racks to guarantee mold-free storage during long transit.",
      technicalSpecifications: [
        { key: "Transit Stability", value: "90+ Days Ambient" },
        { key: "Stem Length", value: "< 1.5 cm Clean Cut" },
        { key: "Container Payload", value: "28 MT / 40ft Reefer Container" }
      ],
      status: "approved"
    },
    {
      sku: "GRL-ORG-04",
      name: "Premium Handpicked White Garlic Bulbs",
      brand: "Malwa Agro Fresh & Garlic Exports",
      companyId: malwaGarlic._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      price: 950,
      mrp: 1250,
      stock: 1500,
      image: "/assets/garlic/garlic-11.jpeg",
      shortDescription: "Artisanal handpicked farm garlic featuring dense clove count and superior medicinal allicin potency.",
      description: "Selected exclusively from certified pesticide-free organic clusters in Malwa plateau, celebrated for spicy punch and high essential oil content.",
      technicalSpecifications: [
        { key: "Grading", value: "Triple Hand-Graded" },
        { key: "Allicin Index", value: "Peak Medicinal Grade" },
        { key: "Origin", value: "Kota-Mandsaur Organic Cluster" }
      ],
      status: "approved"
    }
  ];

  for (const prod of allProducts) {
    const existing = await CatalogueProduct.findOne({ organizationId: org._id, sku: prod.sku });
    if (!existing) {
      await CatalogueProduct.create(prod);
      console.log(`Created product: ${prod.sku} (${prod.name})`);
    } else {
      existing.image = prod.image;
      existing.name = prod.name;
      existing.companyId = prod.companyId;
      existing.technicalSpecifications = prod.technicalSpecifications;
      await existing.save();
      console.log(`Updated product: ${prod.sku}`);
    }
  }

  console.log("All specialty products seeded successfully!");
  process.exit(0);
};

run().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
