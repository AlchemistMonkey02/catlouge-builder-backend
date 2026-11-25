const express = require("express");
const router = express.Router();
const {
  auditImageSpecs,
  exportImageZip,
  applyImageToProduct,
  createProductFromStudio,
  upscaleAndEnhanceImage,
  generateAiBackground,
  neuralAiCutout,
} = require("../controllers/imageStudioController");

router.post("/audit-specs", auditImageSpecs);
router.post("/export-zip", exportImageZip);
router.post("/apply-to-product", applyImageToProduct);
router.post("/create-from-studio", createProductFromStudio);
router.post("/upscale-enhance", upscaleAndEnhanceImage);
router.post("/upscale", upscaleAndEnhanceImage);
router.post("/cutout", neuralAiCutout);
router.post("/remove-bg", neuralAiCutout);
router.post("/generate-bg", generateAiBackground);

module.exports = router;
