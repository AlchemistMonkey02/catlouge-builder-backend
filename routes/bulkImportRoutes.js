const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const {
  uploadAndPreview,
  processBatchImport,
  getBatchStatus,
  downloadSampleTemplate,
  downloadErrorReport,
} = require("../controllers/bulkImportController");

router.post("/upload", upload.single("file"), uploadAndPreview);
router.post("/process", processBatchImport);
router.get("/status/:id", getBatchStatus);
router.get("/template/:format", downloadSampleTemplate);
router.get("/errors/:id", downloadErrorReport);

module.exports = router;
