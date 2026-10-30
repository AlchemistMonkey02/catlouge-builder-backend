require("dotenv").config();
const connectDB = require("../config/db");
const Company = require("../models/Company");
const CatalogueProduct = require("../models/CatalogueProduct");
const { getDefaultOrganization } = require("../middleware/authMiddleware");

const run = async () => {
  await connectDB();
  const org = await getDefaultOrganization();
  console.log("Connected to MongoDB Atlas for Specialty Seed!");

  // --------------------------------------------------------------------------
  // 1. 🧄 Garlic Specialty Company
  // --------------------------------------------------------------------------
  let garlicCompany = await Company.findOne({
    organizationId: org._id,
    name: "Malwa Fresh Garlic & Agro Exports",
  });

  const garlicCompanyData = {
    organizationId: org._id,
    name: "Malwa Fresh Garlic & Agro Exports",
    tagline: "100% Organic Farm Harvest • Grade-A Sizing • Global Cold-Chain Export",
    industry: "Garlic Specialty & Agro Commodities",
    logoUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300",
    brandColors: { primary: "#1b4332", secondary: "#2d6a4f", accent: "#d4af37" },
    contact: {
      email: "export@malwagarlic.in",
      phone: "+91 98260 11223",
      website: "https://www.malwagarlic.in",
      address: "Krishi Upaj Mandi Yard, Plot 42-45, Pipaliya Mandi, Mandsaur & Kota Agri Corridor, MP-RJ – 458664",
    },
    qrLinks: {
      businessProfile: "https://www.malwagarlic.in/catalogue",
      whatsapp: "https://wa.me/919826011223",
      website: "https://www.malwagarlic.in",
      location: "https://maps.google.com/?q=Krishi+Upaj+Mandi+Pipaliya+Mandi",
      instagram: "https://instagram.com/malwagarlicexports",
      custom: "",
      customLabel: "Scan to Order Fresh Harvest",
    },
    legal: { gstNumber: "23AAGCM4589F1Z4", taxId: "PAN-MLWG8821K", currency: "INR" },
    wholesaleTerms: "Export packing in 5kg, 10kg & 20kg red/purple leno mesh bags or corrugated cartons. Reefer container loading (0°C to -2°C). Phytosanitary and Global GAP certified.",
    isDefault: true,
  };

  if (!garlicCompany) {
    garlicCompany = await Company.create(garlicCompanyData);
    console.log("Created Garlic Specialty Company!");
  } else {
    Object.assign(garlicCompany, garlicCompanyData);
    await garlicCompany.save();
    console.log("Updated Garlic Specialty Company!");
  }

  // --------------------------------------------------------------------------
  // 2. 🏛️ Kota Stone Specialty Company
  // --------------------------------------------------------------------------
  let kotaCompany = await Company.findOne({
    organizationId: org._id,
    name: "Supreme Kota Stone & Minerals",
  });

  const kotaCompanyData = {
    organizationId: org._id,
    name: "Supreme Kota Stone & Minerals",
    tagline: "Natural • Durable • Architectural Precision Slabs",
    industry: "Kota Stone & Calibrated Limestone",
    logoUrl: "/assets/reference/p1_2.png",
    brandColors: { primary: "#3f4a3c", secondary: "#1c1917", accent: "#c5a059" },
    contact: {
      email: "info@supremekotastone.in",
      phone: "+91 90668 04666",
      website: "https://www.supremestones.in",
      address: "RIICO Industrial Area, Phase II, Ramganjmandi, Kota District, Rajasthan – 326519",
    },
    qrLinks: {
      businessProfile: "https://www.supremestones.in/catalogue",
      whatsapp: "https://wa.me/919066804666",
      website: "https://www.supremestones.in",
      location: "https://maps.google.com/?q=Ramganjmandi+Kota+Rajasthan",
      instagram: "https://instagram.com/supremestones",
      custom: "",
      customLabel: "Scan for Quarry Pricing",
    },
    legal: { gstNumber: "08AAGCS1234F1Z8", taxId: "PAN-SUPR1234S", currency: "INR" },
    wholesaleTerms: "Calibrated 18-20mm & 25-30mm dimensional slabs with protective wooden pallet box packaging. High compressive strength ASTM tested. FOB Mudra/Kandla & Pan-India dispatch.",
    isDefault: false,
  };

  if (!kotaCompany) {
    kotaCompany = await Company.create(kotaCompanyData);
    console.log("Created Kota Stone Specialty Company!");
  } else {
    Object.assign(kotaCompany, kotaCompanyData);
    await kotaCompany.save();
    console.log("Updated Kota Stone Specialty Company!");
  }

  // --------------------------------------------------------------------------
  // 3. 🏜️ Sand Stone Specialty Company
  // --------------------------------------------------------------------------
  let sandCompany = await Company.findOne({
    organizationId: org._id,
    name: "Marwar Royal Sandstone & Facades",
  });

  const sandCompanyData = {
    organizationId: org._id,
    name: "Marwar Royal Sandstone & Facades",
    tagline: "Imperial Desert Gold • Exotic Veins • Weather-Resistant Cladding",
    industry: "Sandstone Quarrying & Architectural Carving",
    logoUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300",
    brandColors: { primary: "#c27803", secondary: "#4a2c0f", accent: "#e2cfaf" },
    contact: {
      email: "projects@marwarsandstone.com",
      phone: "+91 94141 88990",
      website: "https://www.marwarsandstone.com",
      address: "Mandore Stone & Artisan Cluster, NH-62, Jodhpur, Rajasthan – 342007",
    },
    qrLinks: {
      businessProfile: "https://www.marwarsandstone.com/catalogue",
      whatsapp: "https://wa.me/919414188990",
      website: "https://www.marwarsandstone.com",
      location: "https://maps.google.com/?q=Mandore+Industrial+Area+Jodhpur",
      instagram: "https://instagram.com/marwarsandstone",
      custom: "",
      customLabel: "Scan for Architectural Portfolio",
    },
    legal: { gstNumber: "08AABCM7812L1Z6", taxId: "PAN-MRWR5612R", currency: "INR" },
    wholesaleTerms: "Architectural cut-to-size slabs, hand-chiseled rockface veneers, and CNC carved jali screens. Moisture resistant, frost resistant, seaworthy fumigated wooden crate packing.",
    isDefault: false,
  };

  if (!sandCompany) {
    sandCompany = await Company.create(sandCompanyData);
    console.log("Created Sand Stone Specialty Company!");
  } else {
    Object.assign(sandCompany, sandCompanyData);
    await sandCompany.save();
    console.log("Updated Sand Stone Specialty Company!");
  }

  // --------------------------------------------------------------------------
  // 4. 🥻 Kota Doria Specialty Company
  // --------------------------------------------------------------------------
  let doriaCompany = await Company.findOne({
    organizationId: org._id,
    name: "Kaithun Royal Kota Doria Handlooms",
  });

  const doriaCompanyData = {
    organizationId: org._id,
    name: "Kaithun Royal Kota Doria Handlooms",
    tagline: "Authentic Khat Weave • Pure Zari • Gossamer Silk & Cotton (GI Tag No. 37)",
    industry: "GI-Tagged Kota Doria & Handloom Textiles",
    logoUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300",
    brandColors: { primary: "#b81d66", secondary: "#540b30", accent: "#d4af37" },
    contact: {
      email: "heritage@kaithunkotadoria.org",
      phone: "+91 94600 77112",
      website: "https://www.kaithunkotadoria.org",
      address: "Bunkar Seva Kendra Road, Kaithun Town, Kota District, Rajasthan – 325001",
    },
    qrLinks: {
      businessProfile: "https://www.kaithunkotadoria.org/catalogue",
      whatsapp: "https://wa.me/919460077112",
      website: "https://www.kaithunkotadoria.org",
      location: "https://maps.google.com/?q=Kaithun+Kota+Rajasthan",
      instagram: "https://instagram.com/kaithunhandlooms",
      custom: "",
      customLabel: "Scan for GI Provenance",
    },
    legal: { gstNumber: "08AAAKK3344D1Z2", taxId: "PAN-KTHN9901M", currency: "INR" },
    wholesaleTerms: "Authentic Geographical Indication (GI) certified handloom sarees and dupattas. Minimum order 10 pieces for boutique and designer houses. Custom color dyeing available on request.",
    isDefault: false,
  };

  if (!doriaCompany) {
    doriaCompany = await Company.create(doriaCompanyData);
    console.log("Created Kota Doria Specialty Company!");
  } else {
    Object.assign(doriaCompany, doriaCompanyData);
    await doriaCompany.save();
    console.log("Updated Kota Doria Specialty Company!");
  }

  // --------------------------------------------------------------------------
  // Clean up and populate authentic products for each company
  // --------------------------------------------------------------------------
  await CatalogueProduct.deleteMany({
    companyId: { $in: [garlicCompany._id, kotaCompany._id, sandCompany._id, doriaCompany._id] },
  });

  // 🧄 Garlic Products
  const garlicProducts = [
    {
      sku: "GRL-01-EXP",
      name: "Grade-A Export Fresh Garlic Bulbs (50-65mm)",
      brand: garlicCompany.name,
      companyId: garlicCompany._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      subcategory: "Whole Bulbs",
      price: 180,
      mrp: 240,
      stock: 12000,
      color: "Pure Ivory White",
      materialComposition: "100% Organically Farm-Grown Garlic (Allium sativum)",
      image: "/assets/garlic/garlic-01.jpeg",
      images: [
        { url: "/assets/garlic/garlic-01.jpeg", alt: "Angle 1 (Hero - Large Farm Harvest Bulbs)", isPrimary: true, order: 0 },
        { url: "/assets/garlic/garlic-02.jpeg", alt: "Angle 2 (Bulb Caliber & Root Clean Finish)", order: 1 },
        { url: "/assets/garlic/garlic-03.jpeg", alt: "Angle 3 (Clean White Sun-Cured Skin)", order: 2 },
        { url: "/assets/garlic/garlic-04.jpeg", alt: "Angle 4 (Harvest Mesh Bag Packing Sizing)", order: 3 },
      ],
      shortDescription: "Premium large caliber garlic bulbs carefully sun-cured and graded for export markets with pungent aromatic flavor.",
      description: "Our Grade-A Fresh Garlic Bulbs are sourced directly from fertile Malwa soil. Each bulb measures 50-65mm in diameter with firm, tight cloves enclosed in papery white skins. Cured under natural shade to preserve high allicin content and extended shelf life.",
      keyFeatures: [
        "CALIBER GRADING: Uniform bulb diameter of 50-65mm, ideal for international supermarket standards.",
        "HIGH ALLICIN CONCENTRATION: Potent essential oils delivering rich aroma and culinary punch.",
        "EXTENDED STORAGE LIFE: Moisture balanced to 60-65% for 6+ months stable cold-chain transit.",
      ],
      technicalSpecifications: [
        { key: "Bulb Diameter", value: "50 mm - 65 mm Calibrated" },
        { key: "Moisture Content", value: "62% - 66% Max" },
        { key: "Packaging", value: "10 kg / 20 kg Leno Mesh Bags or Export Cartons" },
        { key: "Certification", value: "APEDA, Global GAP & Phytosanitary Certified" },
      ],
      status: "approved",
    },
    {
      sku: "GRL-02-PEEL",
      name: "Fresh Peeled Garlic Cloves (Vacuum Packed)",
      brand: garlicCompany.name,
      companyId: garlicCompany._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      subcategory: "Processed Cloves",
      price: 260,
      mrp: 320,
      stock: 4500,
      color: "Creamy Ivory",
      materialComposition: "Ready-to-Cook Peeled Cloves",
      image: "/assets/garlic/garlic-05.jpeg",
      images: [
        { url: "/assets/garlic/garlic-05.jpeg", alt: "Angle 1 (Fresh Cloves & Bulb Inspection)", isPrimary: true, order: 0 },
        { url: "/assets/garlic/garlic-06.jpeg", alt: "Angle 2 (High Allicin Pungent Bulbs)", order: 1 },
        { url: "/assets/garlic/garlic-07.jpeg", alt: "Angle 3 (Export Sorting Table)", order: 2 },
      ],
      shortDescription: "Hygienically air-peeled whole garlic cloves vacuum-sealed for commercial kitchens and HoReCa food service.",
      description: "Peeled using state-of-the-art non-damaging pneumatic air peelers. Zero water contact preserves vital enzymes and prevents browning. Vacuum-sealed under food-grade nitrogen flush to guarantee fresh-cut taste for up to 45 days refrigerated.",
      keyFeatures: [
        "100% YIELD READY: Zero peeling labor, zero kitchen waste, instant high-efficiency commercial prep.",
        "NITROGEN FLUSH PACKAGING: Retains moisture and prevents enzymatic browning naturally.",
        "COMMERCIAL REFRIGERATION: Stable shelf life of 45 days at 2°C to 4°C storage.",
      ],
      technicalSpecifications: [
        { key: "Pack Size", value: "500 g, 1 kg, 5 kg Food-Grade Vacuum Pouches" },
        { key: "Clove Condition", value: "Whole, Unbruised, Washed & Sanitized" },
        { key: "Storage Temp", value: "2°C - 4°C Refrigerated" },
      ],
      status: "approved",
    },
    {
      sku: "GRL-03-FLK",
      name: "Dehydrated Garlic Flakes & Toasted Granules",
      brand: garlicCompany.name,
      companyId: garlicCompany._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      subcategory: "Dehydrated & Seasoning",
      price: 340,
      mrp: 420,
      stock: 8000,
      color: "Golden Cream",
      materialComposition: "Dehydrated Garlic Flakes (A-Grade)",
      image: "/assets/garlic/garlic-08.jpeg",
      images: [
        { url: "/assets/garlic/garlic-08.jpeg", alt: "Angle 1 (Bulk Harvest Crate Stacking)", isPrimary: true, order: 0 },
        { url: "/assets/garlic/garlic-09.jpeg", alt: "Angle 2 (Clean Dry Storage Bulbs)", order: 1 },
        { url: "/assets/garlic/garlic-10.jpeg", alt: "Angle 3 (Grading Caliber 50mm+)", order: 2 },
      ],
      shortDescription: "Low-temperature tunnel dehydrated garlic flakes packed with pure aroma, perfect for seasonings and spice blenders.",
      description: "Manufactured from fresh harvest garlic bulbs sliced and dehydrated in continuous hot-air drying tunnels below 60°C. Preserves authentic pungent flavor without scorched off-notes. Widely exported for soup bases, dry seasoning blends, and snack seasoning.",
      keyFeatures: [
        "MOISTURE CONTROL: Moisture below 6% ensures crisp texture and 24-month ambient shelf life.",
        "PRESERVATIVE FREE: 100% pure garlic with zero artificial sulfur or chemical bleaching.",
        "RAPID REHYDRATION: Reconstitutes in warm water in under 3 minutes.",
      ],
      technicalSpecifications: [
        { key: "Moisture", value: "< 6.0% Max" },
        { key: "Mesh / Flake Size", value: "8 - 16 Mesh / 2 - 5 mm Flakes" },
        { key: "Packaging", value: "20 kg Poly-Lined Corrugated Export Carton" },
      ],
      status: "approved",
    },
    {
      sku: "GRL-04-BLK",
      name: "Artisanal Fermented Black Garlic Bulbs (Aged 90 Days)",
      brand: garlicCompany.name,
      companyId: garlicCompany._id,
      organizationId: org._id,
      category: "Garlic Specialty",
      subcategory: "Gourmet Specialty",
      price: 950,
      mrp: 1250,
      stock: 1500,
      color: "Jet Obsidian Black",
      materialComposition: "Aged Fermented Whole Garlic",
      image: "/assets/garlic/garlic-11.jpeg",
      images: [
        { url: "/assets/garlic/garlic-11.jpeg", alt: "Angle 1 (Field Fresh Garlic Bulbs)", isPrimary: true, order: 0 },
        { url: "/assets/garlic/garlic-12.jpeg", alt: "Angle 2 (Naturally Dried Stems)", order: 1 },
        { url: "/assets/garlic/garlic-13.jpeg", alt: "Angle 3 (Premium Clean Cloves Sizing)", order: 2 },
      ],
      shortDescription: "Gourmet black garlic slow-fermented under controlled humidity, producing sweet balsamic umami notes.",
      description: "Carefully aged through a 90-day Maillard reaction under precise thermal humidity cycles. The cloves transform into jelly-soft black jewels with zero raw pungency, developing complex sweet nuances of balsamic fig, tamarind, and molasses.",
      keyFeatures: [
        "S-ALLYLCYSTEINE RICH: Up to 5x higher antioxidant potency than raw garlic.",
        "GOURMET SWEET UMAMI: Spreadable texture perfect for charcuterie boards and sauces.",
        "EXTENDED SHELF STABILITY: Ambient stable for up to 18 months.",
      ],
      technicalSpecifications: [
        { key: "Aging Cycle", value: "90 Days Controlled Fermentation" },
        { key: "Texture", value: "Soft, Jelly-Like, Spreadable" },
        { key: "Packaging", value: "250g Glass Jar / 1kg Vacuum Pouches" },
      ],
      status: "approved",
    },
  ];

  // 🏛️ Kota Stone Products
  const kotaProducts = [
    {
      sku: "KTA-01-CAL",
      name: "Kota Stone Natural Blue-Green Calibrated Slabs",
      brand: kotaCompany.name,
      companyId: kotaCompany._id,
      organizationId: org._id,
      category: "Kota Stone Specialty",
      subcategory: "Calibrated Slabs",
      price: 85,
      mrp: 120,
      stock: 15000,
      color: "Signature Blue-Green",
      materialComposition: "High-Density Natural Limestone (Kota Formation)",
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&auto=format&fit=crop&q=80", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Architectural grade calibrated Kota limestone slabs with uniform 18-20mm thickness and high load capacity.",
      description: "Extracted from deep geological strata in Ramganjmandi quarries. Characterized by fine-grained siliceous limestone with natural slip resistance and exceptional compressive strength (130-145 MPa). Machine calibrated for rapid, joint-free installation.",
      keyFeatures: [
        "CALIBRATED UNIFORMITY: Precise 18mm thickness eliminates levelling bed unevenness.",
        "NATURAL THERMAL COOLING: Maintains comfortable underfoot temperatures in extreme climates.",
        "ACID & WEATHER RESISTANT: Dense mineral matrix resists heavy wear and moisture absorption.",
      ],
      technicalSpecifications: [
        { key: "Dimensions", value: "2 ft x 2 ft [22\" x 22\"] & 2 ft x 4 ft [22\" x 46\"]" },
        { key: "Thickness", value: "18 - 20 mm Calibrated" },
        { key: "Compressive Strength", value: "135 MPa (ASTM C170)" },
        { key: "Water Absorption", value: "< 0.38% (ASTM C97)" },
      ],
      status: "approved",
    },
    {
      sku: "KTA-02-MIR",
      name: "Mirror Polished Kota Stone Flooring Slabs",
      brand: kotaCompany.name,
      companyId: kotaCompany._id,
      organizationId: org._id,
      category: "Kota Stone Specialty",
      subcategory: "Polished Flooring",
      price: 110,
      mrp: 155,
      stock: 8500,
      color: "Deep Forest Blue-Green",
      materialComposition: "High-Gloss Polished Limestone",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "High-reflection mirror polished Kota stone tiles offering luxurious sheen and hygienic low-maintenance surfaces.",
      description: "Processed through 12-head Italian bridge polishing lines to achieve high surface reflectivity and depth of color. The mirror finish brings out subtle mineral clouds while sealing pores against spills and hospital sanitation chemicals.",
      keyFeatures: [
        "HIGH GLOSS REFLECTIVITY: Glass-like surface sheen with rich green saturation.",
        "HOSPITAL & COMMERCIAL GRADE: Seamless jointing prevents bacterial accumulation.",
        "EASY TO RE-POLISH: Retains polish for decades and easily rejuvenated with light buffing.",
      ],
      technicalSpecifications: [
        { key: "Finish", value: "12-Head Diamond Mirror Polish" },
        { key: "Sizes", value: "600 x 600 mm, 600 x 900 mm, 600 x 1200 mm" },
        { key: "Edge Finish", value: "Precision Chamfered Edge" },
      ],
      status: "approved",
    },
    {
      sku: "KTA-03-COB",
      name: "Hand-Cut Chiseled Driveway Cobblestones",
      brand: kotaCompany.name,
      companyId: kotaCompany._id,
      organizationId: org._id,
      category: "Kota Stone Specialty",
      subcategory: "Landscaping & Cobbles",
      price: 65,
      mrp: 90,
      stock: 22000,
      color: "Rustic Grey-Green",
      materialComposition: "Split Rock Limestone",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80",
      images: [
        { url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&auto=format&fit=crop&q=80", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Rugged hand-dressed natural split cobblestones ideal for steep ramps, pedestrian promenades, and rustic pathways.",
      description: "Chiseled by skilled artisans to provide heavy vehicular load bearing. Natural cleave texture ensures 100% non-skid tire grip on parking ramps and outdoor garden plazas in all weather conditions.",
      keyFeatures: [
        "MAXIMUM SLIP RESISTANCE: Safe tire and pedestrian traction even in torrential rains.",
        "HEAVY AXLE LOAD TOLERANCE: Resists cracking under multi-ton trucks and SUVs.",
        "HERITAGE AESTHETIC: Authentic old-world European cobblestone look.",
      ],
      technicalSpecifications: [
        { key: "Dimensions", value: "100 x 100 x 50 mm / 150 x 150 x 60 mm" },
        { key: "Finish", value: "Hand Chiseled Split Rock" },
        { key: "Packing", value: "Loose Dump or Crates (1 Ton / Crate)" },
      ],
      status: "approved",
    },
  ];

  // 🏜️ Sand Stone Products
  const sandProducts = [
    {
      sku: "SND-01-GLD",
      name: "Jodhpur Desert Gold Sandstone Slabs",
      brand: sandCompany.name,
      companyId: sandCompany._id,
      organizationId: org._id,
      category: "Sand Stone Specialty",
      subcategory: "Heritage Cladding",
      price: 135,
      mrp: 190,
      stock: 9500,
      color: "Regal Desert Ochre Gold",
      materialComposition: "Natural Quartzite Sandstone",
      image: "/assets/sand-stone/Jodhpur-Sandstone-Tiles.jpg",
      images: [
        { url: "/assets/sand-stone/Jodhpur-Sandstone-Tiles.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/sand-stone/Autumn-Brown-Sandstone-1024x1024.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/sand-stone/slab1-600x500.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Iconic golden yellow sandstone quarried in Jodhpur, famously utilized in royal palaces and luxury heritage resorts.",
      description: "Celebrated worldwide for its majestic warm hue that turns amber under sunlight. Features dense silica bonding making it naturally resistant to thermal weathering, saline coastal air, and environmental pollution.",
      keyFeatures: [
        "PALATIAL AESTHETIC: Iconic golden desert hue reminiscent of Rajasthan's heritage fortresses.",
        "THERMAL BUFFER: High heat insulation helps keep interior spaces naturally temperate.",
        "EASY TO CARVE: Ideal for monolithic pillars, balustrades, and ornamental cornices.",
      ],
      technicalSpecifications: [
        { key: "Density", value: "2.45 g/cm³" },
        { key: "Thickness", value: "25 mm, 30 mm & 40 mm Sawn" },
        { key: "Standard Sizes", value: "300x600 mm, 600x600 mm, 600x900 mm, 1200x600 mm" },
        { key: "ASTM Testing", value: "Meets ASTM C616 Standard Specification" },
      ],
      status: "approved",
    },
    {
      sku: "SND-02-TEK",
      name: "Teakwood & Rainbow Veined Natural Sandstone",
      brand: sandCompany.name,
      companyId: sandCompany._id,
      organizationId: org._id,
      category: "Sand Stone Specialty",
      subcategory: "Exotic Veined",
      price: 175,
      mrp: 235,
      stock: 4200,
      color: "Wood Grain Brown & Crimson Swirl",
      materialComposition: "Layered Siliceous Sandstone",
      image: "/assets/sand-stone/Rainbow-Sandstone-1024x1024.jpg",
      images: [
        { url: "/assets/sand-stone/Rainbow-Sandstone-1024x1024.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/sand-stone/sand-stone-1.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/sand-stone/sand-stone-2.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Dramatic natural timber grain patterns frozen in ancient stone, creating breathtaking bookmatched accent walls.",
      description: "Each slab reveals undulating swirls of gold, chocolate brown, and violet-red formed by iron oxide mineralization over millions of years. Honed to silky touch for luxury villa foyers, pool decks, and spa retreats.",
      keyFeatures: [
        "UNIQUE NATURAL ARTWORK: No two slabs are identical; authentic one-of-a-kind stone.",
        "EXCELLENT WET GRIP: Natural micro-texture remains safe around swimming pools and jacuzzis.",
        "SAWN SIX SIDES: Precision dimensional cut for contemporary minimalist grout lines.",
      ],
      technicalSpecifications: [
        { key: "Pattern", value: "Fine Linear Grain / Swirling Veins" },
        { key: "Finish", value: "Honed Matte / Brushed Satin" },
        { key: "Thickness Tolerance", value: "± 1 mm Calibrated" },
      ],
      status: "approved",
    },
    {
      sku: "SND-03-JAL",
      name: "Artisanal Carved Sandstone Jali Screen Panel",
      brand: sandCompany.name,
      companyId: sandCompany._id,
      organizationId: org._id,
      category: "Sand Stone Specialty",
      subcategory: "Carved Architectural",
      price: 650,
      mrp: 890,
      stock: 650,
      color: "Dholpur Beige / Jodhpur Gold",
      materialComposition: "Precision Carved Natural Stone",
      image: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
      images: [
        { url: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/sand-stone/sand-stone-3.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/sand-stone/sand-stone-4.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Geometric pierced stone jali panel providing natural breeze ventilation, soft ambient daylighting, and privacy.",
      description: "Combining generational hand-chiseling with precision CNC contouring. Designed for luxury villa facades, courtyard dividers, and backlit interior feature panels.",
      keyFeatures: [
        "PASSIVE CLIMATE CONTROL: Filters harsh sunlight while channeling cooling breezes.",
        "WEATHER-PROOF RESIN SEALED: Treated to prevent algae formation on exterior exposures.",
        "CUSTOM MOTIFS: Available in Moroccan, Mughal floral, and contemporary geometric motifs.",
      ],
      technicalSpecifications: [
        { key: "Standard Size", value: "600 x 1200 mm, 900 x 1800 mm" },
        { key: "Thickness", value: "40 mm - 50 mm Solid Stone" },
        { key: "Mounting", value: "Stainless Steel Concealed Clamp Slots" },
      ],
      status: "approved",
    },
  ];

  // 🥻 Kota Doria Products
  const doriaProducts = [
    {
      sku: "KDR-01-ZAR",
      name: "Royal Crimson & Pure Gold Zari Silk-Cotton Saree",
      brand: doriaCompany.name,
      companyId: doriaCompany._id,
      organizationId: org._id,
      category: "Kota Doria Specialty",
      subcategory: "Zari Silk Sarees",
      price: 4850,
      mrp: 6500,
      stock: 450,
      color: "Royal Crimson & Antique Gold",
      materialComposition: "70% Mulberry Silk, 30% Fine Mallow Cotton, Pure Metallic Zari",
      image: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg",
      images: [
        { url: "/assets/kota-doria/0X2A0389_db4c4b42-1d9b-405b-9ea0-664b5017af38.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/kota-doria/0X2A0390_75eaae16-8321-43ea-98ee-ba1da7cf21e2.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/kota-doria/0X2A0391_960e65d2-a72a-4340-a159-4bf9ff038753.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Handwoven gossamer silk-cotton saree with authentic square khat checks and opulent zari border & pallu.",
      description: "Woven on pit looms by Kaithun master weavers using the signature square khat grid pattern (300+ khats per meter). Mulberry silk warp provides lustrous drape, while cotton weft lends strength and breathability. Crowned with real metallic gold zari weaving on borders and pallu.",
      keyFeatures: [
        "AUTHENTIC GI CERTIFIED: Registered under Geographical Indications of Goods Act (GI Tag No. 37).",
        "FEATHERWEIGHT ELEGANCE: Weighs just 340 grams, providing effortless ethereal all-day drape.",
        "SIGNATURE KHAT WEAVE: Distinctive square checkered structure hand-interlocked with onion-paste starching.",
      ],
      technicalSpecifications: [
        { key: "Length & Width", value: "6.5 Meters (Includes 80 cm Running Blouse Piece)" },
        { key: "Weave Density", value: "300+ Khats per Meter" },
        { key: "Yarn Count", value: "Silk 20/22 Denier, Cotton 100s / 120s" },
        { key: "Zari Quality", value: "Tested Real Lurex Gold Zari" },
      ],
      status: "approved",
    },
    {
      sku: "KDR-02-DUP",
      name: "Artisanal Hand block-Printed Kota Doria Dupatta",
      brand: doriaCompany.name,
      companyId: doriaCompany._id,
      organizationId: org._id,
      category: "Kota Doria Specialty",
      subcategory: "Dupattas & Stoles",
      price: 1650,
      mrp: 2200,
      stock: 1200,
      color: "Peacock Teal & Natural Ecru",
      materialComposition: "Pure Cotton-Silk Kota Doria",
      image: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
      images: [
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-604.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-605.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Sheer handloom dupatta ornamented with traditional wooden block-printed floral buttas and delicate resham tassels.",
      description: "Light-as-air gossamer dupatta designed to elevate festive kurtas, lehengas, and contemporary fusion silhouettes. Hand-stamped with natural non-toxic dyes and finished with handmade tassel fringe.",
      keyFeatures: [
        "ARTISAN BLOCK CRAFT: Hand-stamped motifs by Bagru & Sanganer heritage craftspersons.",
        "AIRY TRANSLUCENCY: Sheer geometric grid breathes effortlessly in warm weather.",
        "VERSATILE STYLING: Drapes gracefully over casual ethnics as well as formal designer eveningwear.",
      ],
      technicalSpecifications: [
        { key: "Dimensions", value: "2.5 Meters Length x 36 Inches Width" },
        { key: "Weight", value: "110 Grams Featherweight" },
        { key: "Care", value: "Dry Clean Only to Preserve Crisp Khat Texture" },
      ],
      status: "approved",
    },
    {
      sku: "KDR-03-PST",
      name: "Pastel Festive Rose Handwoven Saree with Floral Butis",
      brand: doriaCompany.name,
      companyId: doriaCompany._id,
      organizationId: org._id,
      category: "Kota Doria Specialty",
      subcategory: "Festive Drapes",
      price: 3600,
      mrp: 4800,
      stock: 600,
      color: "Blush Rose & Silver Champagne",
      materialComposition: "High-Count Cotton-Silk Blend",
      image: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg",
      images: [
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-127.jpg", alt: "Angle 1 (Hero / Front View)", isPrimary: true, order: 0 },
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-129.jpg", alt: "Angle 2 (Close-up / Texture / Material Detail)", order: 1 },
        { url: "/assets/kota-doria/lucknowi-chikankari-hand-embroidered-kota-doria-cotton-2pc-unstitched-131.jpg", alt: "Angle 3 (Perspective / Application / In-Use Scale)", order: 2 },
      ],
      shortDescription: "Subtle pastel blush rose saree adorned with delicate silver butis, ideal for summer weddings and daytime celebrations.",
      description: "A contemporary masterpiece tailored for modern tastemakers. Combines soft pastel palettes with heritage pit-loom khat construction, delivering an understated luxury that glows under day and evening lights.",
      keyFeatures: [
        "CONTEMPORARY PASTEL PALETTE: Soft blush shade dyed using eco-conscious water-efficient dyes.",
        "CRISP STRUCTURED DRAPE: Holds graceful pleats without feeling heavy or stiff.",
        "INCLUDES BLOUSE PIECE: Comes with coordinated unstitched blouse fabric.",
      ],
      technicalSpecifications: [
        { key: "Length", value: "6.3 Meters" },
        { key: "Border Detail", value: "Woven Silver Zari Meenakari Edge" },
        { key: "Origin", value: "Kaithun, Rajasthan (GI Tag No. 37)" },
      ],
      status: "approved",
    },
  ];

  const allProducts = [...garlicProducts, ...kotaProducts, ...sandProducts, ...doriaProducts];
  const inserted = await CatalogueProduct.insertMany(allProducts);
  console.log(`Successfully seeded ${inserted.length} specialty products across the 4 companies!`);

  console.log("ALL SPECIALTY SEED COMPLETED PERFECTLY!");
  process.exit(0);
};

run().catch((err) => {
  console.error("Error seeding specialty data:", err);
  process.exit(1);
});
