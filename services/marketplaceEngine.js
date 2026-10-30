/**
 * Marketplace Profiles & Rule Validation Engine
 * Implements granular validation criteria for Amazon India, Flipkart, Meesho,
 * Shopify, WooCommerce, WhatsApp Business, and Generic Exports.
 */

const MARKETPLACE_RULES = {
  amazon_in: {
    name: "Amazon India",
    titleMax: 200,
    titleMin: 20,
    bulletPointsMin: 3,
    bulletPointsMax: 5,
    bulletMaxChars: 500,
    requiresHsn: true,
    requiresGst: true,
    requiresDimensions: true,
    requiresWeight: true,
    minImageResolution: 1000,
    prohibitedInTitle: ["free shipping", "sale", "discount", "100% quality", "offer", "bestseller"],
  },
  flipkart: {
    name: "Flipkart",
    titleMax: 150,
    titleMin: 15,
    bulletPointsMin: 3,
    bulletPointsMax: 6,
    requiresHsn: true,
    requiresDimensions: true,
    requiresWeight: true,
    minImageResolution: 800,
    prohibitedInTitle: ["offer", "free", "guaranteed", "hot deal"],
  },
  meesho: {
    name: "Meesho",
    titleMax: 100,
    titleMin: 10,
    bulletPointsMin: 1,
    requiresHsn: false,
    minImageResolution: 600,
  },
  shopify: {
    name: "Shopify Store",
    titleMax: 255,
    titleMin: 3,
    requiresHandle: true,
    requiresPrice: true,
    requiresStock: true,
  },
  whatsapp: {
    name: "WhatsApp Business Catalogue",
    titleMax: 100,
    descriptionMax: 500,
    requiresPrice: true,
    requiresImage: true,
  },
};

const validateProductForMarketplace = (product, marketplaceKey) => {
  const rules = MARKETPLACE_RULES[marketplaceKey];
  const errors = [];
  const warnings = [];

  if (!rules) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // 1. Title validation
  const title = (product.name || "").trim();
  if (!title) {
    errors.push({ field: "name", message: "Title is required", marketplace: marketplaceKey });
  } else {
    if (title.length > rules.titleMax) {
      errors.push({
        field: "name",
        message: `Title exceeds maximum limit of ${rules.titleMax} characters (current: ${title.length})`,
        marketplace: marketplaceKey,
      });
    }
    if (rules.titleMin && title.length < rules.titleMin) {
      warnings.push({
        field: "name",
        message: `Title is shorter than recommended minimum of ${rules.titleMin} characters`,
        marketplace: marketplaceKey,
      });
    }
    if (rules.prohibitedInTitle) {
      for (const phrase of rules.prohibitedInTitle) {
        if (title.toLowerCase().includes(phrase)) {
          errors.push({
            field: "name",
            message: `Title contains forbidden promotional phrase: "${phrase}"`,
            marketplace: marketplaceKey,
          });
        }
      }
    }
  }

  // 2. Pricing & MRP validation
  if (!product.price || product.price <= 0) {
    errors.push({ field: "price", message: "Selling price must be greater than zero", marketplace: marketplaceKey });
  }
  if (product.mrp && product.price && product.mrp < product.price) {
    errors.push({
      field: "mrp",
      message: `MRP (₹${product.mrp}) cannot be lower than Selling Price (₹${product.price})`,
      marketplace: marketplaceKey,
    });
  }

  // 3. Bullet points
  const bullets = product.keyFeatures || [];
  if (rules.bulletPointsMin && bullets.length < rules.bulletPointsMin) {
    warnings.push({
      field: "keyFeatures",
      message: `Requires at least ${rules.bulletPointsMin} bullet points (currently ${bullets.length})`,
      marketplace: marketplaceKey,
    });
  }
  if (rules.bulletMaxChars) {
    bullets.forEach((b, idx) => {
      if (b && b.length > rules.bulletMaxChars) {
        errors.push({
          field: "keyFeatures",
          message: `Bullet point #${idx + 1} exceeds ${rules.bulletMaxChars} characters`,
          marketplace: marketplaceKey,
        });
      }
    });
  }

  // 4. Tax & Regulatory (HSN / Country of Origin)
  if (rules.requiresHsn && !product.hsnCode) {
    errors.push({ field: "hsnCode", message: "HSN code is mandatory for tax compliance", marketplace: marketplaceKey });
  }
  if (!product.countryOfOrigin) {
    warnings.push({ field: "countryOfOrigin", message: "Country of Origin should be specified", marketplace: marketplaceKey });
  }

  // 5. Dimensions & Weight
  if (rules.requiresDimensions) {
    const dim = product.dimensions || {};
    if (!dim.length || !dim.width || !dim.height) {
      warnings.push({ field: "dimensions", message: "Package dimensions (L x W x H) recommended for shipping calculation", marketplace: marketplaceKey });
    }
  }
  if (rules.requiresWeight) {
    const wt = product.weight || {};
    if (!wt.value || wt.value <= 0) {
      warnings.push({ field: "weight", message: "Package shipping weight is recommended", marketplace: marketplaceKey });
    }
  }

  // 6. Images
  const images = product.images || [];
  if (images.length === 0 && !product.image) {
    errors.push({ field: "images", message: "At least one product image is required", marketplace: marketplaceKey });
  }

  const isValid = errors.length === 0;
  return {
    marketplace: marketplaceKey,
    marketplaceName: rules.name,
    isValid,
    errors,
    warnings,
  };
};

// Comprehensive multi-channel audit
const auditProductAcrossMarketplaces = (product) => {
  const marketplaces = ["amazon_in", "flipkart", "meesho", "shopify", "whatsapp"];
  const results = {};
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const mp of marketplaces) {
    const audit = validateProductForMarketplace(product, mp);
    results[mp] = audit;
    totalErrors += audit.errors.length;
    totalWarnings += audit.warnings.length;
  }

  // Calculate readiness score (0 to 100)
  const baseScore = 100;
  const deduction = totalErrors * 15 + totalWarnings * 5;
  const readinessScore = Math.max(10, Math.min(100, baseScore - deduction));

  return {
    readinessScore,
    isValid: totalErrors === 0,
    results,
    totalErrors,
    totalWarnings,
  };
};

module.exports = {
  MARKETPLACE_RULES,
  validateProductForMarketplace,
  auditProductAcrossMarketplaces,
};
