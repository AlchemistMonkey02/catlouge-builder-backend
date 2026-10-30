const CatalogueRecord = require("../models/CatalogueRecord");

/**
 * @desc Get all saved catalogue records
 * @route GET /api/catalogue-records
 */
exports.getRecords = async (req, res) => {
  try {
    const { district, product, status, search } = req.query;
    const query = {};

    if (req.organizationId) {
      query.organizationId = req.organizationId;
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
 * @desc Get single catalogue record by ID
 * @route GET /api/catalogue-records/:id
 */
exports.getRecordById = async (req, res) => {
  try {
    const record = await CatalogueRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
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
