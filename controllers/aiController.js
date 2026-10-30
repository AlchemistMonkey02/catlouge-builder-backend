/**
 * AI Controller (Commented out - AI features disabled)
 */

/*
const {
  generateTitleVariations,
  generateDescriptions,
  generateKeywordsAndSeo,
  predictCategoryAndAttributes,
  rewriteField,
} = require("../services/aiService");
const CatalogueProduct = require("../models/CatalogueProduct");
const Organization = require("../models/Organization");
const pdfParse = require("pdf-parse");
*/

const generateProductContent = (req, res) => {
  res.status(400).json({ success: false, message: "AI generation features have been disabled." });
};

const predictCategory = (req, res) => {
  res.status(400).json({ success: false, message: "AI category prediction has been disabled." });
};

const rewriteSingleField = (req, res) => {
  res.status(400).json({ success: false, message: "AI rewriting has been disabled." });
};

const extractFromPdf = (req, res) => {
  res.status(400).json({ success: false, message: "AI PDF extraction has been disabled." });
};

const extractFromUrl = (req, res) => {
  res.status(400).json({ success: false, message: "AI URL extraction has been disabled." });
};

module.exports = {
  generateProductContent,
  predictCategory,
  rewriteSingleField,
  extractFromPdf,
  extractFromUrl,
};
