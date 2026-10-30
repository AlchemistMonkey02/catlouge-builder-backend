const Organization = require("../models/Organization");
const AuditLog = require("../models/AuditLog");

const getOrganizationProfile = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.organizationId);
    if (!org) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }
    res.json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

const updateOrganizationProfile = async (req, res, next) => {
  try {
    const { businessProfile, name } = req.body;
    const org = await Organization.findById(req.organizationId);

    if (!org) {
      return res.status(404).json({ success: false, message: "Organization not found" });
    }

    if (name) org.name = name;
    if (businessProfile) {
      org.businessProfile = {
        ...org.businessProfile.toObject(),
        ...businessProfile,
      };
    }

    await org.save();

    await AuditLog.create({
      organizationId: req.organizationId,
      userId: req.user._id,
      userName: req.user.name,
      action: "Updated Brand Kit & Business Profile",
      entityType: "BrandKit",
      details: { name: org.name },
    });

    res.json({ success: true, data: org });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizationProfile,
  updateOrganizationProfile,
};
