const mongoose = require("mongoose");

const batchImportSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["csv", "xlsx", "pdf", "url_list"],
      default: "csv",
    },
    totalRows: {
      type: Number,
      default: 0,
    },
    processedRows: {
      type: Number,
      default: 0,
    },
    successfulRows: {
      type: Number,
      default: 0,
    },
    failedRows: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "partial_failure", "failed"],
      default: "pending",
    },
    columnMapping: {
      type: Map,
      of: String,
    },
    errors: [
      {
        rowNumber: { type: Number },
        sku: { type: String },
        error: { type: String },
        originalData: { type: mongoose.Schema.Types.Mixed },
      },
    ],
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

module.exports = mongoose.model("BatchImport", batchImportSchema);
