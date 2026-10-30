const mongoose = require("mongoose");

const catalogueRecordSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    ent_name: {
      type: String,
      required: [true, "Enterprise/Company name is required"],
      trim: true,
    },
    district: {
      type: String,
      default: "India",
      trim: true,
    },
    product: {
      type: String,
      default: "General",
      trim: true,
    },
    person: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      default: "",
      trim: true,
    },
    udyam_no: {
      type: String,
      default: "",
      trim: true,
    },
    odop_ref: {
      type: String,
      default: "",
      trim: true,
    },
    batch_no: {
      type: String,
      default: "",
      trim: true,
    },
    template_uid: {
      type: String,
      default: "editorial:ed-kd1",
    },
    color: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "final"],
      default: "draft",
    },
    form_json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    variants_json: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    design_edits_json: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    logo_file: {
      type: String,
      default: "",
    },
    pdf_file: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

catalogueRecordSchema.index({ district: 1, product: 1 });
catalogueRecordSchema.index({ ent_name: 1 });

module.exports = mongoose.model("CatalogueRecord", catalogueRecordSchema);
