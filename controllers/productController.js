const Product = require("../models/Product");

/**
 * @desc    Get all products with search, filtering, sorting & pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;

    // Build the Mongo filter object incrementally based on which
    // query params were actually provided.
    const filter = {};

    if (req.query.search) {
      // Uses the text index defined on Product (name + description).
      // $text search is case-insensitive by default.
      filter.$text = { $search: req.query.search };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.brand) {
      // Case-insensitive exact-ish match on brand
      filter.brand = { $regex: `^${req.query.brand}$`, $options: "i" };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = req.query.minPrice;
      if (req.query.maxPrice) filter.price.$lte = req.query.maxPrice;
    }

    if (req.query.rating) {
      filter.rating = { $gte: req.query.rating };
    }

    // Map the friendly `sort` query param to a Mongoose sort object
    let sortOption = { createdAt: -1 }; // default: newest first
    switch (req.query.sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        break;
    }

    // Run the count and the actual query in parallel to save time.
    // .lean() returns plain JS objects instead of full Mongoose
    // documents, which is faster and uses less memory for read-only
    // responses like this one.
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    ]);

    const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product by id
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the distinct list of categories (with product counts)
 * @route   GET /api/products/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
      { $sort: { category: 1 } },
    ]);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public (would be admin-only in a real deployment)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, image, rating, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      image,
      rating,
      stock,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public (would be admin-only in a real deployment)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public (would be admin-only in a real deployment)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
