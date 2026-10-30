const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      default: "System",
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      enum: ["Product", "Catalogue", "BatchImport", "BrandKit", "Export", "Marketplace"],
      default: "Product",
    },
    entityId: {
      type: String,
      default: "",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ organizationId: 1, createdAt: -1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
