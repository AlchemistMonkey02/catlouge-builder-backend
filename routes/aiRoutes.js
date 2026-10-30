const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// AI Features completely commented out / disabled
/*
const {
  generateProductContent,
  predictCategory,
  rewriteSingleField,
  extractFromPdf,
  extractFromUrl,
} = require("../controllers/aiController");

router.post("/generate", generateProductContent);
router.post("/predict-category", predictCategory);
router.post("/rewrite-field", rewriteSingleField);
router.post("/extract-from-pdf", upload.single("pdfFile"), extractFromPdf);
router.post("/extract-from-url", extractFromUrl);
*/

router.all("*", (req, res) => {
  res.status(404).json({ success: false, message: "AI features have been disabled." });
});

module.exports = router;
