const Company = require("../models/Company");
const AuditLog = require("../models/AuditLog");

// Initial diverse companies for immediate multi-company catalogue generation
const DEFAULT_COMPANIES = [
  {
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
      customLabel: "Scan to Order",
    },
    legal: { gstNumber: "29AAGCS1234F1Z9", taxId: "PAN-SUPR1234S", currency: "INR" },
    wholesaleTerms: "Nationwide Coverage. Calibrated and box packed. Customized CNC patterns, surface finishes, and sizes tailored to residential, commercial, and landscaping projects.",
    isDefault: true,
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

    // Auto-seed diverse default companies if organization has none
    if (companies.length === 0) {
      const seeded = DEFAULT_COMPANIES.map((c) => ({
        ...c,
        organizationId: req.organizationId,
      }));
      companies = await Company.insertMany(seeded);
    }

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
    const { name, tagline, logoUrl, brandColors, contact, legal, wholesaleTerms, industry } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Company name is required" });
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
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      req.body,
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
