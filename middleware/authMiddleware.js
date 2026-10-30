const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");

const JWT_SECRET = process.env.JWT_SECRET || "ecommerce_catalogue_builder_jwt_secret_key_2026";

// Cached default organization for smooth out-of-the-box experience
let defaultOrgId = null;

const getDefaultOrganization = async () => {
  if (defaultOrgId) {
    const existing = await Organization.findById(defaultOrgId);
    if (existing) return existing;
  }
  let org = await Organization.findOne({ slug: "default-store" });
  if (!org) {
    org = await Organization.create({
      name: "ai Brands & Catalogues",
      slug: "default-store",
      businessProfile: {
        legalName: "ai Commerce Enterprises Pvt Ltd",
        gstNumber: "07AAAAA0000A1Z5",
        supportEmail: "catalogues@aibrands.com",
        supportPhone: "+91 98765 43210",
        websiteUrl: "https://aibrands.example.com",
        brandColors: {
          primary: "#6366f1",
          secondary: "#0f172a",
          accent: "#10b981",
        },
        tone: "professional",
        defaultPolicies: {
          warranty: "1 Year Standard Manufacturer Warranty",
          care: "Store in cool dry conditions. Avoid abrasive materials.",
          returnPolicy: "7 Days Instant Return & Replacement",
          shippingInfo: "Dispatches within 24h via Express Air Cargo",
        },
      },
    });
  }
  defaultOrgId = org._id;
  return org;
};

const tenantContext = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
          req.user = user;
          req.organizationId = user.organizationId;
          const org = await Organization.findById(user.organizationId);
          req.organization = org;
          return next();
        }
      } catch (err) {
        // Fall back to default organization if token is invalid or expired
        console.warn("Invalid JWT token provided, falling back to default tenant:", err.message);
      }
    }

    // Default tenant for immediate usability
    const defaultOrg = await getDefaultOrganization();
    req.organization = defaultOrg;
    req.organizationId = defaultOrg._id;
    req.user = {
      _id: null,
      name: "Store Administrator",
      email: "admin@aibrands.com",
      role: "owner",
      organizationId: defaultOrg._id,
    };
    next();
  } catch (error) {
    console.error("Error in tenant context middleware:", error);
    next(error);
  }
};

module.exports = {
  tenantContext,
  getDefaultOrganization,
};
