const { body, param, query, validationResult } = require("express-validator");

/**
 * Runs after the validation chains below and short-circuits the request
 * with a 400 response if any validator failed. Keeps controllers clean —
 * by the time a request reaches a controller, we know the input is valid.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Validation rules for creating a product (POST /api/products)
const validateCreateProduct = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 150 }),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ max: 2000 }),
  body("price").notEmpty().withMessage("Price is required").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Electronics", "Fashion", "Home", "Sports", "Books"])
    .withMessage("Category must be one of Electronics, Fashion, Home, Sports, Books"),
  body("brand").trim().notEmpty().withMessage("Brand is required"),
  body("image").optional({ checkFalsy: true }).isURL().withMessage("Image must be a valid URL"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock cannot be negative"),
  handleValidationErrors,
];

// Validation rules for updating a product (PUT /api/products/:id)
const validateUpdateProduct = [
  param("id").isMongoId().withMessage("Invalid product id"),
  body("name").optional().trim().isLength({ max: 150 }),
  body("description").optional().trim().isLength({ max: 2000 }),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .trim()
    .isIn(["Electronics", "Fashion", "Home", "Sports", "Books"])
    .withMessage("Category must be one of Electronics, Fashion, Home, Sports, Books"),
  body("brand").optional().trim(),
  body("image").optional({ checkFalsy: true }).isURL().withMessage("Image must be a valid URL"),
  body("rating").optional().isFloat({ min: 0, max: 5 }),
  body("stock").optional().isInt({ min: 0 }),
  handleValidationErrors,
];

// Validates the :id route param for GET one / DELETE
const validateMongoIdParam = [param("id").isMongoId().withMessage("Invalid product id"), handleValidationErrors];

// Validates and sanitizes the query params on GET /api/products
const validateProductQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100").toInt(),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a positive number").toFloat(),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a positive number").toFloat(),
  query("rating").optional().isFloat({ min: 0, max: 5 }).toFloat(),
  query("sort")
    .optional()
    .isIn(["price_asc", "price_desc", "newest", "rating"])
    .withMessage("sort must be one of price_asc, price_desc, newest, rating"),
  handleValidationErrors,
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateMongoIdParam,
  validateProductQuery,
};
