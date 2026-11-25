const Company = require("../models/Company");
const AuditLog = require("../models/AuditLog");
const { getDefaultDataBank, resolveCompanyCategory, resolveCompanyLocation } = require("../utils/defaultDataBank");

const getCompanies = async (req, res, next) => {
  try {
    let companies = await Company.find({ organizationId: req.organizationId }).lean();
    if (!companies || companies.length === 0) {
      companies = await Company.find({}).lean();
    }

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

    let finalDistrict = (district && district.trim()) ? district.trim() : "";
    let finalOdop = (odopProduct && odopProduct.trim()) ? odopProduct.trim() : "";

    const lowerName = (name || "").toLowerCase();
    const lowerInd = (industry || "").toLowerCase();
    const lowerAddr = (contact?.address || "").toLowerCase();

    if (!finalDistrict) {
      if (lowerAddr.includes("mandsaur")) finalDistrict = "Mandsaur, MP";
      else if (lowerAddr.includes("baran")) finalDistrict = "Baran, Rajasthan";
      else if (lowerAddr.includes("jodhpur")) finalDistrict = "Jodhpur, Rajasthan";
      else if (lowerAddr.includes("bundi")) finalDistrict = "Bundi, Rajasthan";
      else if (lowerAddr.includes("jhalawar") || lowerAddr.includes("suket")) finalDistrict = "Jhalawar, Rajasthan";
      else if (lowerAddr.includes("bangalore") || lowerAddr.includes("jigani")) finalDistrict = "Bangalore, Karnataka";
      else if (finalOdop === "Garlic") finalDistrict = "Baran, Rajasthan";
      else if (finalOdop === "Kota Stone") finalDistrict = "Jhalawar, Rajasthan";
      else if (finalOdop === "Sandstone") finalDistrict = "Bundi, Rajasthan";
      else if (finalOdop === "Kota Doria") finalDistrict = "Kota, Rajasthan";
      else finalDistrict = state || "Location Pending";
    }

    if (!finalOdop) {
      if (lowerName.includes("garlic") || lowerInd.includes("garlic")) finalOdop = "Garlic";
      else if (lowerName.includes("sand") || lowerInd.includes("sand")) finalOdop = "Sandstone";
      else if (lowerName.includes("stone") || lowerInd.includes("stone")) finalOdop = "Kota Stone";
      else if (lowerName.includes("doria") || lowerInd.includes("doria")) finalOdop = "Kota Doria";
      else finalOdop = industry || "General";
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
      odopProduct: finalOdop,
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
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.organizationId;

    let company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    if (!company) {
      company = await Company.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData },
        { new: true, runValidators: false }
      );
    }

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
    let company = await Company.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId,
    });

    if (!company) {
      company = await Company.findByIdAndDelete(req.params.id);
    }

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company profile deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getCompanyDataBank = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    const expectedFamily = resolveCompanyCategory(company);
    let dataBank = company.dataBank;
    if (!dataBank || !dataBank.specifications || !dataBank.family || dataBank.family !== expectedFamily) {
      dataBank = getDefaultDataBank(company);
      company.dataBank = dataBank;
      await company.save();
    }

    res.json({ success: true, data: dataBank });
  } catch (error) {
    next(error);
  }
};

const updateCompanyDataBank = async (req, res, next) => {
  try {
    const { dataBank } = req.body;
    if (!dataBank) {
      return res.status(400).json({ success: false, message: "dataBank payload is required" });
    }

    let company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { dataBank } },
      { new: true, runValidators: false }
    );

    if (!company) {
      company = await Company.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { dataBank } },
        { new: true, runValidators: false }
      );
    }

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, data: company.dataBank, message: "Company Data Bank saved successfully" });
  } catch (error) {
    next(error);
  }
};

const resetCompanyDataBank = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    const freshDataBank = getDefaultDataBank(company);
    company.dataBank = freshDataBank;
    await company.save();

    res.json({ success: true, data: freshDataBank, message: "Data Bank reset to industry defaults" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyDataBank,
  updateCompanyDataBank,
  resetCompanyDataBank,
};
