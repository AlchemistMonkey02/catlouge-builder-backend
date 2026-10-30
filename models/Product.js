const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      enum: {
        values: ["Electronics", "Fashion", "Home", "Sports", "Books"],
        message: "{VALUE} is not a supported category",
      },
    },
    brand: {
      type: String,
      required: [true, "Product brand is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x400.png?text=Product+Image",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

/**
 * INDEX STRATEGY
 * ---------------------------------------------------------------
 * 1. Text index on name + description
 *    Powers the `?search=` query. Mongo's text index tokenizes and
 *    stores words from both fields so we can run a single
 *    `$text: { $search: "..." }` query instead of slow regex scans
 *    across the whole collection. Weighting `name` higher means a
 *    match in the product name ranks above a match buried in the
 *    description.
 *
 * 2. Single-field index on category
 *    The catalog is filtered by category constantly (category pills,
 *    category page). Without an index, Mongo has to scan every
 *    document (a "collection scan") to find matches; the index turns
 *    that into a fast B-tree lookup.
 *
 * 3. Single-field index on brand
 *    Same reasoning as category — brand is a very common filter and
 *    benefits from its own index.
 *
 * 4. Single-field index on price
 *    Needed for minPrice/maxPrice range queries and for price-based
 *    sorting (price_asc / price_desc). An index lets Mongo satisfy
 *    range queries and sorts without scanning + sorting in memory.
 *
 * 5. Single-field index on createdAt
 *    Powers the "Newest" sort option so recently added products can
 *    be retrieved in indexed order instead of a full sort at query time.
 *
 * 6. Compound index on (category, price)
 *    A very common real-world query pattern is "products in category X
 *    sorted/filtered by price". A compound index serves both the
 *    category filter and the price range/sort in one index rather than
 *    Mongo combining two separate indexes.
 * ---------------------------------------------------------------
 */
productSchema.index({ name: "text", description: "text" }, { weights: { name: 5, description: 1 } });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
