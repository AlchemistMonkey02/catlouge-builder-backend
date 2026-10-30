const CatalogueProduct = require("../models/CatalogueProduct");
const AuditLog = require("../models/AuditLog");
const { auditProductAcrossMarketplaces } = require("../services/marketplaceEngine");
const { generateTitleVariations, generateDescriptions, generateKeywordsAndSeo } = require("../services/aiService");

/**
 * Get all catalogue products with advanced filtering and pagination
 */
const getCatalogueProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { organizationId: req.organizationId };

    if (req.query.projectId) {
      query.projectId = req.query.projectId;
    }

    if (req.query.companyId && req.query.companyId !== "All") {
      query.companyId = req.query.companyId;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { sku: { $regex: req.query.search, $options: "i" } },
        { brand: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.brand && req.query.brand !== "All") {
      query.brand = { $regex: `^${req.query.brand}$`, $options: "i" };
    }

    if (req.query.status && req.query.status !== "All") {
      query.status = req.query.status;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    let sortOption = { updatedAt: -1 };
    switch (req.query.sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "readiness_desc":
        sortOption = { "validationResults.readinessScore": -1 };
        break;
      default:
        sortOption = { updatedAt: -1 };
        break;
    }

    const [products, total] = await Promise.all([
      CatalogueProduct.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
      CatalogueProduct.countDocuments(query),
    ]);

    // Aggregate status counts for dashboard filters
    const statusCounts = await CatalogueProduct.aggregate([
      { $match: { organizationId: req.organizationId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const countsMap = {
      total,
      draft: 0,
      needs_review: 0,
      validated: 0,
      approved: 0,
      exported: 0,
      published: 0,
    };

    statusCounts.forEach((sc) => {
      if (countsMap.hasOwnProperty(sc._id)) {
        countsMap[sc._id] = sc.count;
      }
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit) || 1,
          limit,
        },
        counts: countsMap,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 */
const getCatalogueProductById = async (req, res, next) => {
  try {
    const product = await CatalogueProduct.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Run real-time channel compliance audit
    const channelAudit = auditProductAcrossMarketplaces(product);

    res.json({
      success: true,
      data: {
        product,
        channelAudit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product manually
 */
const createCatalogueProduct = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      organizationId: req.organizationId,
    };

    // Auto SKU if missing
    if (!data.sku) {
      data.sku = `SKU-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Check SKU uniqueness within organization
    const existingSku = await CatalogueProduct.findOne({
      organizationId: req.organizationId,
      sku: data.sku,
    });

    if (existingSku) {
      return res.status(400).json({ success: false, message: `SKU "${data.sku}" already exists in your catalogue` });
    }

    // Run initial validation
    const audit = auditProductAcrossMarketplaces(data);
    data.validationResults = {
      isValid: audit.isValid,
      readinessScore: audit.readinessScore,
      errors: Object.values(audit.results).flatMap((r) => r.errors),
      warnings: Object.values(audit.results).flatMap((r) => r.warnings),
      lastChecked: new Date(),
    };

    const product = await CatalogueProduct.create(data);

    // Audit log
    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Created Product",
      entityType: "Product",
      entityId: product._id.toString(),
      details: { sku: product.sku, name: product.name },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product
 */
const updateCatalogueProduct = async (req, res, next) => {
  try {
    const product = await CatalogueProduct.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if updating locked fields accidentally
    const updates = req.body;

    // Apply updates
    Object.keys(updates).forEach((key) => {
      if (key !== "_id" && key !== "organizationId") {
        product[key] = updates[key];
      }
    });

    // Re-run validation audit
    const audit = auditProductAcrossMarketplaces(product);
    product.validationResults = {
      isValid: audit.isValid,
      readinessScore: audit.readinessScore,
      errors: Object.values(audit.results).flatMap((r) => r.errors),
      warnings: Object.values(audit.results).flatMap((r) => r.warnings),
      lastChecked: new Date(),
    };

    await product.save();

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Updated Product",
      entityType: "Product",
      entityId: product._id.toString(),
      details: { sku: product.sku, name: product.name },
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 */
const deleteCatalogueProduct = async (req, res, next) => {
  try {
    const product = await CatalogueProduct.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Deleted Product",
      entityType: "Product",
      entityId: req.params.id,
      details: { sku: product.sku },
    });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Duplicate a product
 */
const duplicateCatalogueProduct = async (req, res, next) => {
  try {
    const original = await CatalogueProduct.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    }).lean();

    if (!original) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    delete original._id;
    delete original.createdAt;
    delete original.updatedAt;

    original.name = `${original.name} (Copy)`;
    original.sku = `${original.sku}-COPY-${Math.floor(Math.random() * 1000)}`;
    original.status = "draft";
    original.source = "duplicate";

    const duplicate = await CatalogueProduct.create(original);

    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    next(error);
  }
};

/**
 * Bulk actions across multiple selected products
 */
const bulkActions = async (req, res, next) => {
  try {
    const { productIds, action, payload } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: "No products selected" });
    }

    let result = {};

    switch (action) {
      case "update_status":
        result = await CatalogueProduct.updateMany(
          { _id: { $in: productIds }, organizationId: req.organizationId },
          { $set: { status: payload.status } }
        );
        break;

      case "update_category":
        result = await CatalogueProduct.updateMany(
          { _id: { $in: productIds }, organizationId: req.organizationId },
          { $set: { category: payload.category } }
        );
        break;

      case "update_brand":
        result = await CatalogueProduct.updateMany(
          { _id: { $in: productIds }, organizationId: req.organizationId },
          { $set: { brand: payload.brand } }
        );
        break;

      case "delete":
        result = await CatalogueProduct.deleteMany({
          _id: { $in: productIds },
          organizationId: req.organizationId,
        });
        break;

      case "ai_enrich":
        // Enrich multiple products with AI
        const products = await CatalogueProduct.find({
          _id: { $in: productIds },
          organizationId: req.organizationId,
        });

        for (const p of products) {
          if (!p.fieldLocks?.title) {
            const titles = generateTitleVariations(p, p.brand);
            p.aiTitleOptions = titles;
            p.name = titles[0].title;
          }
          if (!p.fieldLocks?.description) {
            const desc = generateDescriptions(p);
            p.shortDescription = desc.shortDescription;
            p.description = desc.detailedDescription;
            p.keyFeatures = desc.keyFeatures;
          }
          if (!p.fieldLocks?.bullets) {
            const seo = generateKeywordsAndSeo(p);
            p.keywords = seo.keywords;
            p.seo = seo.seo;
          }
          p.status = "needs_review";
          await p.save();
        }
        return res.json({ success: true, message: `Successfully enriched ${products.length} products with AI` });

      default:
        return res.status(400).json({ success: false, message: "Unknown action" });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle field lock on product to prevent AI overwrite
 */
const toggleFieldLock = async (req, res, next) => {
  try {
    const { field } = req.body;
    const product = await CatalogueProduct.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (!product.fieldLocks) {
      product.fieldLocks = {};
    }

    product.fieldLocks[field] = !product.fieldLocks[field];
    await product.save();

    res.json({
      success: true,
      data: {
        field,
        isLocked: product.fieldLocks[field],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCatalogueProducts,
  getCatalogueProductById,
  createCatalogueProduct,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  duplicateCatalogueProduct,
  bulkActions,
  toggleFieldLock,
};
