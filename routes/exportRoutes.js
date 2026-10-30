const express = require("express");
const router = express.Router();
const {
  getExportValidationReport,
  exportCatalogue,
  publishSandbox,
} = require("../controllers/exportController");

router.post("/validate-report", getExportValidationReport);
router.post("/download", exportCatalogue);
router.post("/publish-sandbox", publishSandbox);

module.exports = router;
