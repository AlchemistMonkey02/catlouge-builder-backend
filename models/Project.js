const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    targetMarketplaces: [
      {
        type: String,
        enum: [
          "amazon_in",
          "flipkart",
          "meesho",
          "shopify",
          "woocommerce",
          "whatsapp",
          "instagram",
          "generic_csv",
        ],
      },
    ],
    status: {
      type: String,
      enum: ["active", "archived", "completed"],
      default: "active",
    },
    brandName: {
      type: String,
      default: "",
    },
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
