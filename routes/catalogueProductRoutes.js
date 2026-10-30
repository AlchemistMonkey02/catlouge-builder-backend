const express = require("express");
const router = express.Router();
const {
  getCatalogueProducts,
  getCatalogueProductById,
  createCatalogueProduct,
  updateCatalogueProduct,
  deleteCatalogueProduct,
  duplicateCatalogueProduct,
  bulkActions,
  toggleFieldLock,
} = require("../controllers/catalogueProductController");

router.get("/", getCatalogueProducts);
router.post("/", createCatalogueProduct);
router.post("/bulk-actions", bulkActions);
router.get("/:id", getCatalogueProductById);
router.put("/:id", updateCatalogueProduct);
router.delete("/:id", deleteCatalogueProduct);
router.post("/:id/duplicate", duplicateCatalogueProduct);
router.post("/:id/toggle-lock", toggleFieldLock);

module.exports = router;
