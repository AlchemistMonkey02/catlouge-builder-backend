const xlsx = require("xlsx");
const CatalogueProduct = require("../models/CatalogueProduct");
const AuditLog = require("../models/AuditLog");
const { validateProductForMarketplace } = require("../services/marketplaceEngine");

/**
 * Pre-export validation audit report
 */
const getExportValidationReport = async (req, res, next) => {
  try {
    const { marketplace = "amazon_in", productIds, projectId } = req.body;

    const query = { organizationId: req.organizationId };
    if (productIds && productIds.length > 0) {
      query._id = { $in: productIds };
    } else if (projectId) {
      query.projectId = projectId;
    }

    const products = await CatalogueProduct.find(query).lean();

    const readyProducts = [];
    const warningProducts = [];
    const blockedProducts = [];

    products.forEach((p) => {
      const audit = validateProductForMarketplace(p, marketplace);
      if (audit.errors.length > 0) {
        blockedProducts.push({
          _id: p._id,
          sku: p.sku,
          name: p.name,
          errors: audit.errors,
          warnings: audit.warnings,
        });
      } else if (audit.warnings.length > 0) {
        warningProducts.push({
          _id: p._id,
          sku: p.sku,
          name: p.name,
          warnings: audit.warnings,
        });
      } else {
        readyProducts.push({
          _id: p._id,
          sku: p.sku,
          name: p.name,
        });
      }
    });

    res.json({
      success: true,
      data: {
        marketplace,
        totalChecked: products.length,
        summary: {
          readyCount: readyProducts.length,
          warningCount: warningProducts.length,
          blockedCount: blockedProducts.length,
          isExportable: blockedProducts.length === 0,
        },
        readyProducts,
        warningProducts,
        blockedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate formatted export file (XLSX, CSV, JSON)
 */
const exportCatalogue = async (req, res, next) => {
  try {
    const { marketplace = "amazon_in", format = "xlsx", productIds, projectId, includeWarnings = true } = req.body;

    const query = { organizationId: req.organizationId };
    if (productIds && productIds.length > 0) {
      query._id = { $in: productIds };
    } else if (projectId) {
      query.projectId = projectId;
    }

    const products = await CatalogueProduct.find(query).lean();

    if (products.length === 0) {
      return res.status(400).json({ success: false, message: "No products found to export" });
    }

    // Filter out blocked products if necessary
    const exportableProducts = products.filter((p) => {
      const audit = validateProductForMarketplace(p, marketplace);
      return audit.errors.length === 0 || includeWarnings;
    });

    let exportRows = [];

    if (marketplace === "amazon_in") {
      // Amazon India Flat File Format
      exportRows = exportableProducts.map((p) => ({
        "item_sku": p.sku,
        "item_name": p.name,
        "brand_name": p.brand,
        "feed_product_type": p.category.toLowerCase(),
        "standard_price": p.price,
        "list_price": p.mrp || p.price,
        "quantity": p.stock,
        "main_image_url": p.image || (p.images[0] && p.images[0].url) || "",
        "bullet_point1": (p.keyFeatures && p.keyFeatures[0]) || "",
        "bullet_point2": (p.keyFeatures && p.keyFeatures[1]) || "",
        "bullet_point3": (p.keyFeatures && p.keyFeatures[2]) || "",
        "bullet_point4": (p.keyFeatures && p.keyFeatures[3]) || "",
        "bullet_point5": (p.keyFeatures && p.keyFeatures[4]) || "",
        "product_description": p.description,
        "country_of_origin": p.countryOfOrigin || "India",
        "hsn_code": p.hsnCode || "",
        "generic_keywords": (p.keywords && p.keywords.searchTerms && p.keywords.searchTerms.join(", ")) || "",
      }));
    } else if (marketplace === "flipkart") {
      // Flipkart Listing Format
      exportRows = exportableProducts.map((p) => ({
        "Seller SKU": p.sku,
        "Product Title": p.name,
        "Brand": p.brand,
        "Your Selling Price (INR)": p.price,
        "MRP (INR)": p.mrp || p.price,
        "Stock Count": p.stock,
        "Main Image": p.image || (p.images[0] && p.images[0].url) || "",
        "Description": p.description,
        "Key Feature 1": (p.keyFeatures && p.keyFeatures[0]) || "",
        "Key Feature 2": (p.keyFeatures && p.keyFeatures[1]) || "",
        "Key Feature 3": (p.keyFeatures && p.keyFeatures[2]) || "",
        "Package Weight (g)": p.weight?.value || 350,
        "Package Length (cm)": p.dimensions?.length || 20,
        "Package Width (cm)": p.dimensions?.width || 15,
        "Package Height (cm)": p.dimensions?.height || 5,
        "HSN": p.hsnCode || "",
      }));
    } else if (marketplace === "shopify") {
      // Shopify Official CSV Format
      exportRows = exportableProducts.map((p) => ({
        "Handle": p.seo?.slug || p.sku.toLowerCase(),
        "Title": p.name,
        "Body (HTML)": `<p>${p.description}</p>`,
        "Vendor": p.brand,
        "Type": p.category,
        "Tags": (p.keywords?.primary || []).concat(p.keywords?.secondary || []).join(", "),
        "Published": "TRUE",
        "Option1 Name": "Title",
        "Option1 Value": "Default Title",
        "Variant SKU": p.sku,
        "Variant Grams": (p.weight?.unit === "kg" ? p.weight.value * 1000 : p.weight?.value) || 200,
        "Variant Inventory Qty": p.stock,
        "Variant Price": p.price,
        "Variant Compare At Price": p.mrp || p.price,
        "Image Src": p.image || (p.images[0] && p.images[0].url) || "",
      }));
    } else {
      // Universal Master PIM Format
      exportRows = exportableProducts.map((p) => ({
        "SKU": p.sku,
        "Title": p.name,
        "Brand": p.brand,
        "Category": p.category,
        "Subcategory": p.subcategory || "",
        "Selling Price": p.price,
        "MRP": p.mrp || "",
        "Stock": p.stock,
        "Short Description": p.shortDescription || "",
        "Detailed Description": p.description,
        "Bullet Points": (p.keyFeatures || []).join(" | "),
        "Material": p.materialComposition || "",
        "Color": p.color || "",
        "Size": p.size || "",
        "HSN Code": p.hsnCode || "",
        "Country of Origin": p.countryOfOrigin || "India",
        "Primary Image": p.image || "",
        "Status": p.status,
      }));
    }

    // Update product statuses to exported if currently validated or approved
    await CatalogueProduct.updateMany(
      { _id: { $in: exportableProducts.map((p) => p._id) }, status: { $in: ["validated", "approved"] } },
      { $set: { status: "exported" } }
    );

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Exported Catalogue",
      entityType: "Export",
      details: { marketplace, format, productCount: exportRows.length },
    });

    if (format === "json") {
      return res.json({ success: true, count: exportRows.length, data: exportRows });
    }

    const worksheet = xlsx.utils.json_to_sheet(exportRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, marketplace.toUpperCase());

    const buffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: format === "csv" ? "csv" : "xlsx",
    });

    const fileExt = format === "csv" ? "csv" : "xlsx";
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${marketplace.toUpperCase()}_Catalogue_Export.${fileExt}"`
    );
    res.setHeader(
      "Content-Type",
      format === "csv" ? "text/csv" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Simulate Direct API Publishing Sandbox (SP-API / Flipkart / Shopify)
 */
const publishSandbox = async (req, res, next) => {
  try {
    const { marketplace = "amazon_in", productIds } = req.body;

    const query = { organizationId: req.organizationId };
    if (productIds && productIds.length > 0) {
      query._id = { $in: productIds };
    }

    const products = await CatalogueProduct.find(query);

    if (products.length === 0) {
      return res.status(400).json({ success: false, message: "No products available to publish" });
    }

    // Verify all have no blocking errors
    const blocked = products.filter((p) => !validateProductForMarketplace(p, marketplace).isValid);
    if (blocked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot publish: ${blocked.length} products have validation errors. Fix errors or remove them first.`,
        blockedSkus: blocked.map((p) => p.sku),
      });
    }

    // Mark as submitted / published
    const submissionId = `SUB-${marketplace.toUpperCase().slice(0, 3)}-${Date.now().toString(36).toUpperCase()}`;

    await CatalogueProduct.updateMany(
      { _id: { $in: products.map((p) => p._id) } },
      { $set: { status: "submitted" } }
    );

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Published to Marketplace Sandbox",
      entityType: "Marketplace",
      details: { marketplace, submissionId, productCount: products.length },
    });

    res.json({
      success: true,
      message: `Successfully submitted ${products.length} listings to ${marketplace} API Gateway Sandbox`,
      data: {
        submissionId,
        marketplace,
        publishedCount: products.length,
        status: "submitted",
        gatewayResponse: {
          code: 200,
          feedSubmissionId: `${Date.now()}`,
          message: "Feed received and queued for ingestion by marketplace indexers",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExportValidationReport,
  exportCatalogue,
  publishSandbox,
};
