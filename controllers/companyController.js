const Company = require("../models/Company");
const AuditLog = require("../models/AuditLog");

// Initial diverse companies for immediate multi-company catalogue generation
const DEFAULT_COMPANIES = [
  {
    name: "Supreme Granite & Stones",
    tagline: "Natural • Durable • Timeless",
    industry: "Kota Stone Architectural Mining & Paving",
    district: "Jhalawar, Rajasthan",
    state: "Rajasthan",
    odopProduct: "Kota Stone",
    enterpriseType: "ODOP Certified Enterprise",
    logoUrl: "/assets/reference/p1_2.png",
    brandColors: { primary: "#4E5C43", secondary: "#1C1917", accent: "#C5A059" },
    contact: {
      email: "info@supremestones.in",
      phone: "+91 9066804666",
      website: "https://www.supremestones.in",
      address: "RIICO Industrial Area, Suket, Jhalawar, Rajasthan – 326514",
    },
    qrLinks: {
      businessProfile: "https://www.supremestones.in/catalogue",
      whatsapp: "https://wa.me/919066804666",
      website: "https://www.supremestones.in",
      location: "https://maps.google.com/?q=Suket+Jhalawar+Rajasthan",
      instagram: "https://instagram.com/supremestones",
      custom: "",
      customLabel: "Scan to Order",
    },
    legal: { gstNumber: "08AAGCS1234F1Z9", taxId: "PAN-SUPR1234S", currency: "INR" },
    wholesaleTerms: "Nationwide Coverage. Calibrated and box packed. Customized CNC patterns, surface finishes, and sizes tailored to residential, commercial, and landscaping projects.",
    isDefault: true,
  },
  {
    name: "Malwa Agro Fresh & Garlic Exports",
    tagline: "Farm-Fresh High-Allicin Cured Garlic Bulbs",
    industry: "Garlic Agro-Commodity & Exports",
    district: "Baran, Rajasthan",
    state: "Rajasthan",
    odopProduct: "Garlic",
    enterpriseType: "ODOP Certified Producer",
    logoUrl: "/assets/garlic/garlic-01.jpeg",
    brandColors: { primary: "#15803d", secondary: "#14532d", accent: "#f59e0b" },
    contact: {
      email: "export@malwa-garlic.in",
      phone: "+91 94140 12345",
      website: "https://www.malwa-garlic.in",
      address: "Baran Krishi Upaj Mandi, Industrial Yard, Baran, Rajasthan – 325205",
    },
    qrLinks: {
      businessProfile: "https://www.malwa-garlic.in/odop",
      whatsapp: "https://wa.me/919414012345",
      website: "https://www.malwa-garlic.in",
    },
    legal: { gstNumber: "08AABCM5678G1Z3", taxId: "PAN-MLWA5678B", currency: "INR" },
    wholesaleTerms: "Export & wholesale lots in 25kg & 50kg ventilated mesh bags. Containerized reefer shipping available.",
    isDefault: false,
  },
  {
    name: "Parampara Threads",
    tagline: "GI Certified Gossamer Handloom Drapes",
    industry: "Kota Doria Handlooms & Sarees",
    district: "Kota, Rajasthan",
    state: "Rajasthan",
    odopProduct: "Kota Doria",
    enterpriseType: "ODOP Artisan Guild",
    logoUrl: "/assets/kota-doria/bagru-hand-block-print-kota-doria-cotton-natural-dyed-3pc-unstitched-602.jpg",
    brandColors: { primary: "#be185d", secondary: "#831843", accent: "#f59e0b" },
    contact: {
      email: "concierge@kotadoria-royal.in",
      phone: "+91 94600 77112",
      website: "https://www.kaithunkotadoria.org",
      address: "Bunkar Seva Kendra Road, Kaithun, Kota District, Rajasthan – 325001",
    },
    qrLinks: {
      businessProfile: "https://www.kaithunkotadoria.org/collection",
      whatsapp: "https://wa.me/919460077112",
      website: "https://www.kaithunkotadoria.org",
    },
    legal: { gstNumber: "08AAAKK3344D1Z2", taxId: "PAN-PRMP3344K", currency: "INR" },
    wholesaleTerms: "Direct weaver master-craft drapes. Authentic square khat GI benchmark with Tested Gold Zari.",
    isDefault: false,
  },
  {
    name: "Royal Heritage Sandstones",
    tagline: "Sedimentary Quartz Sandstone Mining & Architectural Cladding",
    industry: "Heritage Sandstone Mining & Architectural Mining",
    district: "Bundi, Rajasthan",
    state: "Rajasthan",
    odopProduct: "Sandstone",
    enterpriseType: "ODOP Quarry Enterprise",
    logoUrl: "/assets/sand-stone/Agra-Red-Sandstone-Sandblasted.jpg",
    brandColors: { primary: "#c2410c", secondary: "#7c2d12", accent: "#eab308" },
    contact: {
      email: "quarry@bundisandstone.in",
      phone: "+91 94141 99887",
      website: "https://www.bundisandstone.in",
      address: "Bundi Sandstone Cluster, RIICO Phase II, Bundi, Rajasthan – 323001",
    },
    qrLinks: {
      businessProfile: "https://www.bundisandstone.in/quarry",
      whatsapp: "https://wa.me/919414199887",
      website: "https://www.bundisandstone.in",
    },
    legal: { gstNumber: "08AABCR9911P1Z4", taxId: "PAN-RYAL9911C", currency: "INR" },
    wholesaleTerms: "Truckload quarry slabs and sawn calibrated tiles for commercial facade cladding and landscape paving.",
    isDefault: false,
  },
  {
    name: "ai Audio Innovations",
    tagline: "Acoustic Engineering & Precision Sound",
    industry: "Consumer Electronics",
    logoUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200",
    brandColors: { primary: "#4f46e5", secondary: "#0f172a", accent: "#06b6d4" },
    contact: {
      email: "orders@aiaudio.com",
      phone: "+91 (11) 4567-8900",
      website: "https://www.aiaudio.com",
      address: "DLF CyberCity, Tower 8B, Gurugram, HR 122002",
    },
    legal: { gstNumber: "07AAACA1234A1Z1", taxId: "PAN-ai1234T", currency: "INR" },
    wholesaleTerms: "Trade discount: 35% on orders exceeding ₹50,000. All audio hardware covered by 1-year commercial replacement warranty.",
    isDefault: false,
  },
  {
    name: "Velvet & Thread Apparel",
    tagline: "Sustainable Luxury & Contemporary Silhouettes",
    industry: "Fashion & Apparel",
    logoUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200",
    brandColors: { primary: "#831843", secondary: "#18181b", accent: "#f59e0b" },
    contact: {
      email: "wholesale@velvetandthread.com",
      phone: "+91 (22) 2850-1234",
      website: "https://www.velvetandthread.com",
      address: "Bandra Kurla Complex, G-Block, Mumbai, MH 400051",
    },
    legal: { gstNumber: "27BBBCT5678B1Z2", taxId: "PAN-VELV5678A", currency: "INR" },
    wholesaleTerms: "MOQ: 24 pieces per style across sizes (S-XL). Pre-season orders eligible for 5% early booking incentive.",
    isDefault: false,
  },
  {
    name: "Aura Botanica Naturals",
    tagline: "Clean Formulas • Cold-Pressed • Organic Living",
    industry: "Beauty & Wellness",
    logoUrl: "https://images.unsplash.com/photo-1608248597359-bb6e42b8e8f8?w=200",
    brandColors: { primary: "#047857", secondary: "#064e3b", accent: "#10b981" },
    contact: {
      email: "b2b@aurabotanica.com",
      phone: "+91 (80) 6789-5555",
      website: "https://www.aurabotanica.com",
      address: "Indiranagar 100ft Road, Bengaluru, KA 560038",
    },
    legal: { gstNumber: "29CCCDE9012C1Z3", taxId: "PAN-AURA9012W", currency: "INR" },
    wholesaleTerms: "100% Organic certified line. Eco-friendly recycled packaging. Shelf life: 24 months from manufacturing date.",
    isDefault: false,
  },
  {
    name: "Nordic Haven Furniture",
    tagline: "Scandinavian Minimalism & Solid Wood Craft",
    industry: "Home Decor & Living",
    logoUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200",
    brandColors: { primary: "#b45309", secondary: "#1c1917", accent: "#fbbf24" },
    contact: {
      email: "projects@nordichaven.com",
      phone: "+91 (44) 4321-9988",
      website: "https://www.nordichaven.com",
      address: "Anna Salai Design District, Chennai, TN 600002",
    },
    legal: { gstNumber: "33DDDFA3456D1Z4", taxId: "PAN-NORD3456H", currency: "INR" },
    wholesaleTerms: "White-glove flat-pack dispatch. Custom timber finishes available for contract interior design projects.",
    isDefault: false,
  },
];

const getCompanies = async (req, res, next) => {
  try {
    let companies = await Company.find({ organizationId: req.organizationId });

    // Auto-correct any legacy or missing ODOP product & district mappings
    companies = companies.map((c) => {
      const cObj = c.toObject ? c.toObject() : { ...c };
      const name = (cObj.name || "").toLowerCase();
      const ind = (cObj.industry || "").toLowerCase();
      let odop = cObj.odopProduct;
      let dist = cObj.district;

      if (!odop || (odop === "Kota Doria" && (name.includes("garlic") || ind.includes("garlic") || (name.includes("stone") && !name.includes("sand")) || ind.includes("stone") || name.includes("sand")))) {
        if (name.includes("garlic") || ind.includes("garlic") || ind.includes("lahsun")) {
          odop = "Garlic";
          dist = "Baran, Rajasthan";
        } else if (name.includes("sand") || ind.includes("sand")) {
          odop = "Sandstone";
          dist = "Bundi, Rajasthan";
        } else if (name.includes("stone") || ind.includes("stone") || ind.includes("limestone")) {
          odop = "Kota Stone";
          dist = "Jhalawar, Rajasthan";
        } else if (name.includes("doria") || ind.includes("doria") || ind.includes("handloom")) {
          odop = "Kota Doria";
          dist = "Kota, Rajasthan";
        }
      }

      if (!dist || dist === "India") {
        if (odop === "Garlic") dist = "Baran, Rajasthan";
        else if (odop === "Kota Stone") dist = "Jhalawar, Rajasthan";
        else if (odop === "Sandstone") dist = "Bundi, Rajasthan";
        else if (odop === "Kota Doria") dist = "Kota, Rajasthan";
      }

      cObj.odopProduct = odop || "Kota Doria";
      cObj.district = dist || "Kota, Rajasthan";
      return cObj;
    });

    const priorityKeywords = [
      "garlic",
      "kota stone",
      "sandstone",
      "sand stone",
      "kota doria",
      "doria"
    ];
    companies.sort((a, b) => {
      const aKey = ((a.name || "") + " " + (a.industry || "")).toLowerCase();
      const bKey = ((b.name || "") + " " + (b.industry || "")).toLowerCase();
      const aIdx = priorityKeywords.findIndex((k) => aKey.includes(k));
      const bIdx = priorityKeywords.findIndex((k) => bKey.includes(k));
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return 0;
    });

    res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

const createCompany = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      logoUrl,
      brandColors,
      contact,
      legal,
      wholesaleTerms,
      industry,
      district,
      state,
      odopProduct,
      enterpriseType,
      whatsappNumber,
      giTagNumber,
      udyamNumber,
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Company name is required" });
    }

    let finalDistrict = district;
    let finalOdop = odopProduct;

    const lowerName = (name || "").toLowerCase();
    const lowerInd = (industry || "").toLowerCase();

    // If odop is empty or set to legacy default "Kota Doria" while name/ind is clearly a different craft:
    if (!finalOdop || (finalOdop === "Kota Doria" && (lowerName.includes("garlic") || lowerInd.includes("garlic") || (lowerName.includes("stone") && !lowerName.includes("sand")) || (lowerInd.includes("stone") && !lowerInd.includes("sand")) || lowerName.includes("sand")))) {
      if (lowerName.includes("garlic") || lowerInd.includes("garlic") || lowerInd.includes("lahsun")) {
        finalDistrict = "Baran, Rajasthan";
        finalOdop = "Garlic";
      } else if (lowerName.includes("sand") || lowerInd.includes("sand")) {
        finalDistrict = "Bundi, Rajasthan";
        finalOdop = "Sandstone";
      } else if (lowerName.includes("stone") || lowerInd.includes("stone") || lowerInd.includes("limestone")) {
        finalDistrict = "Jhalawar, Rajasthan";
        finalOdop = "Kota Stone";
      } else if (lowerName.includes("doria") || lowerInd.includes("doria") || lowerInd.includes("saree") || lowerInd.includes("handloom")) {
        finalDistrict = "Kota, Rajasthan";
        finalOdop = "Kota Doria";
      }
    }

    if (!finalDistrict || finalDistrict === "India") {
      if (finalOdop === "Garlic") {
        finalDistrict = "Baran, Rajasthan";
      } else if (finalOdop === "Kota Stone") {
        finalDistrict = "Jhalawar, Rajasthan";
      } else if (finalOdop === "Sandstone") {
        finalDistrict = "Bundi, Rajasthan";
      } else {
        finalDistrict = "Kota, Rajasthan";
      }
    }

    const company = await Company.create({
      organizationId: req.organizationId,
      name,
      tagline: tagline || "Product Collection",
      logoUrl: logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
      brandColors: brandColors || { primary: "#6366f1", secondary: "#0f172a", accent: "#10b981" },
      contact: contact || {},
      qrLinks: req.body.qrLinks || {},
      legal: legal || {},
      wholesaleTerms: wholesaleTerms || "Standard B2B terms apply.",
      industry: industry || "General",
      district: finalDistrict,
      state: state || "Rajasthan",
      odopProduct: finalOdop || "Kota Doria",
      enterpriseType: enterpriseType || "ODOP Certified Enterprise",
      whatsappNumber: whatsappNumber || (contact && (contact.phone || contact.mobile)) || "+91 94600 77112",
      giTagNumber: giTagNumber || "",
      udyamNumber: udyamNumber || "",
    });

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user?._id,
      userName: req.user?.name || "System",
      action: "Created Company Profile",
      entityType: "BrandKit",
      entityId: company._id.toString(),
      details: { name: company.name },
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    const lowerName = (updateData.name || "").toLowerCase();
    const lowerInd = (updateData.industry || "").toLowerCase();

    if (updateData.odopProduct === "Kota Doria" && (lowerName.includes("garlic") || lowerInd.includes("garlic") || (lowerName.includes("stone") && !lowerName.includes("sand")) || (lowerInd.includes("stone") && !lowerInd.includes("sand")) || lowerName.includes("sand"))) {
      if (lowerName.includes("garlic") || lowerInd.includes("garlic") || lowerInd.includes("lahsun")) {
        updateData.district = "Baran, Rajasthan";
        updateData.odopProduct = "Garlic";
      } else if (lowerName.includes("sand") || lowerInd.includes("sand")) {
        updateData.district = "Bundi, Rajasthan";
        updateData.odopProduct = "Sandstone";
      } else if (lowerName.includes("stone") || lowerInd.includes("stone") || lowerInd.includes("limestone")) {
        updateData.district = "Jhalawar, Rajasthan";
        updateData.odopProduct = "Kota Stone";
      }
    }

    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      updateData,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company profile deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
};
