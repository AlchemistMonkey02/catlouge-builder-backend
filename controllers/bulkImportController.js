const xlsx = require("xlsx");
const CatalogueProduct = require("../models/CatalogueProduct");
const BatchImport = require("../models/BatchImport");
const AuditLog = require("../models/AuditLog");
const { auditProductAcrossMarketplaces } = require("../services/marketplaceEngine");

// Standard PIM fields available for mapping
const TARGET_FIELDS = [
  { key: "sku", label: "SKU / Product ID", required: true },
  { key: "name", label: "Product Title / Name", required: true },
  { key: "brand", label: "Brand Name", required: true },
  { key: "category", label: "Category", required: true },
  { key: "price", label: "Selling Price", required: true },
  { key: "mrp", label: "MRP / List Price", required: false },
  { key: "stock", label: "Stock Quantity", required: false },
  { key: "description", label: "Description", required: false },
  { key: "image", label: "Primary Image URL", required: false },
  { key: "color", label: "Color", required: false },
  { key: "size", label: "Size", required: false },
  { key: "materialComposition", label: "Material", required: false },
  { key: "hsnCode", label: "HSN Code", required: false },
  { key: "countryOfOrigin", label: "Country of Origin", required: false },
];

/**
 * Upload spreadsheet, inspect headers, and return preview + auto-mapping
 */
const uploadAndPreview = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No spreadsheet file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (!rawData || rawData.length < 2) {
      return res.status(400).json({ success: false, message: "Spreadsheet is empty or lacks data rows" });
    }

    const headers = rawData[0].map((h) => String(h || "").trim()).filter(Boolean);
    const rows = xlsx.utils.sheet_to_json(worksheet);

    // Auto-map columns using fuzzy matching
    const suggestedMapping = {};
    headers.forEach((header) => {
      const lower = header.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lower.includes("sku") || lower.includes("productid") || lower.includes("itemcode")) {
        suggestedMapping[header] = "sku";
      } else if (lower.includes("title") || lower.includes("name") || lower.includes("productname")) {
        suggestedMapping[header] = "name";
      } else if (lower.includes("brand") || lower.includes("manufacturer")) {
        suggestedMapping[header] = "brand";
      } else if (lower.includes("category") || lower.includes("dept")) {
        suggestedMapping[header] = "category";
      } else if (lower.includes("price") || lower.includes("sellingprice") || lower.includes("rate")) {
        suggestedMapping[header] = "price";
      } else if (lower.includes("mrp") || lower.includes("listprice")) {
        suggestedMapping[header] = "mrp";
      } else if (lower.includes("stock") || lower.includes("qty") || lower.includes("quantity")) {
        suggestedMapping[header] = "stock";
      } else if (lower.includes("desc") || lower.includes("details")) {
        suggestedMapping[header] = "description";
      } else if (lower.includes("image") || lower.includes("photo") || lower.includes("picture")) {
        suggestedMapping[header] = "image";
      } else if (lower.includes("color") || lower.includes("colour")) {
        suggestedMapping[header] = "color";
      } else if (lower.includes("size")) {
        suggestedMapping[header] = "size";
      } else if (lower.includes("material")) {
        suggestedMapping[header] = "materialComposition";
      } else if (lower.includes("hsn")) {
        suggestedMapping[header] = "hsnCode";
      }
    });

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        totalRows: rows.length,
        headers,
        previewRows: rows.slice(0, 5),
        allRows: rows,
        suggestedMapping,
        targetFields: TARGET_FIELDS,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Execute batch import with mapped columns
 */
const processBatchImport = async (req, res, next) => {
  try {
    const { fileName, rows, columnMapping, projectId } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: "No data rows to import" });
    }

    const batch = await BatchImport.create({
      organizationId: req.organizationId,
      projectId: projectId || null,
      fileName: fileName || "batch_import.xlsx",
      totalRows: rows.length,
      status: "processing",
      columnMapping,
    });

    let successfulRows = 0;
    let failedRows = 0;
    const errors = [];

    // Existing SKUs cache to prevent duplicates
    const existingProducts = await CatalogueProduct.find(
      { organizationId: req.organizationId },
      { sku: 1 }
    ).lean();
    const existingSkuSet = new Set(existingProducts.map((p) => p.sku.toLowerCase()));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // spreadsheet index

      try {
        // Construct product from mapping
        const productData = {
          organizationId: req.organizationId,
          projectId: projectId || null,
          source: "xlsx",
        };

        for (const [colName, targetField] of Object.entries(columnMapping)) {
          if (targetField && row[colName] !== undefined) {
            productData[targetField] = row[colName];
          }
        }

        // Validate SKU
        if (!productData.sku) {
          productData.sku = `SKU-IMP-${Date.now().toString(36)}-${i}`;
        } else {
          productData.sku = String(productData.sku).trim();
        }

        if (existingSkuSet.has(productData.sku.toLowerCase())) {
          throw new Error(`Duplicate SKU "${productData.sku}" already exists`);
        }

        // Validate required fields
        if (!productData.name) {
          throw new Error("Missing required product Title/Name");
        }
        if (!productData.brand) {
          productData.brand = "ai";
        }
        if (!productData.category) {
          productData.category = "Electronics";
        }

        productData.price = Number(productData.price) || 0;
        productData.mrp = Number(productData.mrp) || productData.price * 1.25;
        productData.stock = Number(productData.stock) || 10;
        if (!productData.description) {
          productData.description = `${productData.name} by ${productData.brand}. Standard quality product.`;
        }

        if (productData.image) {
          productData.images = [
            {
              url: productData.image,
              isPrimary: true,
              backgroundType: "original",
            },
          ];
        }

        // Run marketplace audit
        const audit = auditProductAcrossMarketplaces(productData);
        productData.validationResults = {
          isValid: audit.isValid,
          readinessScore: audit.readinessScore,
          errors: Object.values(audit.results).flatMap((r) => r.errors),
          warnings: Object.values(audit.results).flatMap((r) => r.warnings),
          lastChecked: new Date(),
        };

        await CatalogueProduct.create(productData);
        existingSkuSet.add(productData.sku.toLowerCase());
        successfulRows++;
      } catch (err) {
        failedRows++;
        errors.push({
          rowNumber,
          sku: row[columnMapping.sku] || "UNKNOWN",
          error: err.message,
          originalData: row,
        });
      }
    }

    batch.processedRows = rows.length;
    batch.successfulRows = successfulRows;
    batch.failedRows = failedRows;
    batch.errors = errors;
    batch.status = failedRows === 0 ? "completed" : successfulRows > 0 ? "partial_failure" : "failed";
    await batch.save();

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Bulk Imported Products",
      entityType: "BatchImport",
      entityId: batch._id.toString(),
      details: { total: rows.length, success: successfulRows, failed: failedRows },
    });

    res.json({
      success: true,
      data: {
        batchId: batch._id,
        total: rows.length,
        successfulRows,
        failedRows,
        status: batch.status,
        errors: errors.slice(0, 50),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Batch Status & Error Logs
 */
const getBatchStatus = async (req, res, next) => {
  try {
    const batch = await BatchImport.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({ success: true, data: batch });
  } catch (error) {
    next(error);
  }
};

/**
 * Download sample catalogue template (.xlsx or .csv)
 */
const downloadSampleTemplate = async (req, res, next) => {
  try {
    const format = req.params.format || "xlsx";

    const sampleData = [
      {
        "SKU": "APX-TECH-001",
        "Product Name": "ai Ultra Wireless Noise-Cancelling Headphones",
        "Brand": "ai",
        "Category": "Electronics",
        "Selling Price": 4999,
        "MRP": 8999,
        "Stock": 45,
        "Color": "Matte Black",
        "Material": "Anodized Aluminum & Memory Foam",
        "Description": "High fidelity wireless noise cancelling headphones with 40-hour playback and rapid USB-C charging.",
        "HSN Code": "85183000",
        "Country of Origin": "India",
        "Image URL": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      },
      {
        "SKU": "APX-FASH-002",
        "Product Name": "ai Pure Organic Cotton Oversized Tee",
        "Brand": "ai",
        "Category": "Fashion",
        "Selling Price": 899,
        "MRP": 1499,
        "Stock": 120,
        "Color": "Sage Green",
        "Material": "100% Combed Cotton",
        "Description": "Ultra-soft breathable cotton oversized t-shirt designed for everyday relaxation and casual streetwear.",
        "HSN Code": "61091000",
        "Country of Origin": "India",
        "Image URL": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      },
      {
        "SKU": "APX-HOME-003",
        "Product Name": "ai Ergonomic Memory Foam Lumbar Cushion",
        "Brand": "ai",
        "Category": "Home",
        "Selling Price": 1299,
        "MRP": 2199,
        "Stock": 60,
        "Color": "Charcoal Grey",
        "Material": "High-Density Viscoelastic Foam",
        "Description": "Orthopedic contoured lumbar back support cushion for office chairs and cars.",
        "HSN Code": "94049000",
        "Country of Origin": "India",
        "Image URL": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800",
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(sampleData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Catalogue_Template");

    const buffer = xlsx.write(workbook, {
      type: "buffer",
      bookType: format === "csv" ? "csv" : "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Catalogue_Bulk_Template.${format === "csv" ? "csv" : "xlsx"}"`
    );
    res.setHeader(
      "Content-Type",
      format === "csv"
        ? "text/csv"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

/**
 * Download error report for a batch import
 */
const downloadErrorReport = async (req, res, next) => {
  try {
    const batch = await BatchImport.findOne({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!batch || !batch.errors || batch.errors.length === 0) {
      return res.status(404).json({ success: false, message: "No errors found for this batch" });
    }

    const errorRows = batch.errors.map((err) => ({
      "Row Number": err.rowNumber,
      "SKU": err.sku,
      "Failure Reason": err.error,
      ...err.originalData,
    }));

    const worksheet = xlsx.utils.json_to_sheet(errorRows);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Failed_Rows");

    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", `attachment; filename="Batch_${batch._id}_Errors.xlsx"`);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndPreview,
  processBatchImport,
  getBatchStatus,
  downloadSampleTemplate,
  downloadErrorReport,
};
