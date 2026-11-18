const mongoose = require("mongoose");
const CatalogueRecord = require("../models/CatalogueRecord");

/**
 * @desc Get all saved catalogue records
 * @route GET /api/catalogue-records
 */
exports.getRecords = async (req, res) => {
  try {
    const { district, product, status, search, companyId } = req.query;
    const query = {};

    if (req.organizationId) {
      query.organizationId = req.organizationId;
    }
    if (companyId) {
      query.companyId = companyId;
    }
    if (district) query.district = new RegExp(district, "i");
    if (product) query.product = new RegExp(product, "i");
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { ent_name: new RegExp(search, "i") },
        { district: new RegExp(search, "i") },
        { product: new RegExp(search, "i") },
        { udyam_no: new RegExp(search, "i") },
      ];
    }

    const records = await CatalogueRecord.find(query)
      .sort({ updatedAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Get single catalogue record by ID or slug (publicly viewable)
 * @route GET /api/catalogue-records/:id
 */
exports.getRecordById = async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let record = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      record = await CatalogueRecord.findById(idOrSlug);
    }
    if (!record) {
      record = await CatalogueRecord.findOne({ liveSlug: idOrSlug });
    }
    if (!record) {
      record = await CatalogueRecord.findOne({
        $or: [
          { liveSlug: new RegExp(`^${idOrSlug}$`, "i") },
          { ent_name: new RegExp(`^${idOrSlug.replace(/-/g, " ")}$`, "i") }
        ]
      });
    }
    if (!record) {
      return res.status(404).json({ success: false, message: "Catalogue record not found" });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Publish catalogue record live with full HTML and public share link
 * @route POST /api/catalogue-records/:id/publish-live
 */
exports.publishLiveRecord = async (req, res) => {
  try {
    const record = await CatalogueRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Catalogue record not found" });
    }
    record.isLive = true;
    record.status = "final";
    if (req.body.pagesHtml) record.pagesHtml = req.body.pagesHtml;
    if (req.body.liveUrl) record.liveUrl = req.body.liveUrl;
    if (req.body.liveSlug) record.liveSlug = req.body.liveSlug;
    await record.save();
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc Create new catalogue record in MongoDB
 * @route POST /api/catalogue-records
 */
exports.createRecord = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      organizationId: req.organizationId || null,
    };
    const record = await CatalogueRecord.create(payload);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc Update existing catalogue record in MongoDB
 * @route PUT /api/catalogue-records/:id
 */
exports.updateRecord = async (req, res) => {
  try {
    const record = await CatalogueRecord.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc Delete catalogue record from MongoDB
 * @route DELETE /api/catalogue-records/:id
 */
exports.deleteRecord = async (req, res) => {
  try {
    const record = await CatalogueRecord.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.json({ success: true, message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
