const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoIdParam,
  validateProductQuery,
} = require("../middleware/validationMiddleware");

// IMPORTANT: /categories must be declared BEFORE /:id, otherwise
// Express would treat "categories" as an :id value.
router.get("/categories", getCategories);

router.get("/", validateProductQuery, getProducts);
router.get("/:id", validateMongoIdParam, getProductById);

router.post("/", validateCreateProduct, createProduct);
router.put("/:id", validateUpdateProduct, updateProduct);
router.delete("/:id", validateMongoIdParam, deleteProduct);

module.exports = router;
