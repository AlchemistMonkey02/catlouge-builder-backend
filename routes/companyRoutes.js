const express = require("express");
const router = express.Router();
const {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyDataBank,
  updateCompanyDataBank,
  resetCompanyDataBank,
} = require("../controllers/companyController");

router.get("/", getCompanies);
router.post("/", createCompany);
router.get("/:id/databank", getCompanyDataBank);
router.put("/:id/databank", updateCompanyDataBank);
router.post("/:id/databank/reset", resetCompanyDataBank);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
