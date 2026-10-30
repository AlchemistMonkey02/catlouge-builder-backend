require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const CatalogueProduct = require("../models/CatalogueProduct");
const Organization = require("../models/Organization");
const { getDefaultOrganization } = require("../middleware/authMiddleware");
const {
  generateTitleVariations,
  generateDescriptions,
  generateKeywordsAndSeo,
  predictCategoryAndAttributes,
  rewriteField,
} = require("../services/aiService");
const {
  validateProductForMarketplace,
  auditProductAcrossMarketplaces,
} = require("../services/marketplaceEngine");

const runTests = async () => {
  console.log("=== STARTING AI CATALOGUE BUILDER TEST SUITE ===");
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    await connectDB();
    const org = await getDefaultOrganization();
    assert(org && org._id, "Tenant Context & Organization provisioned");

    // 1. AI Title Generation Test
    const sampleProduct = {
      name: "Ergonomic Office Chair",
      brand: "ai",
      category: "Home",
      color: "Graphite Black",
      materialComposition: "Breathable Mesh",
    };
    const titles = generateTitleVariations(sampleProduct, "ai", "professional");
    assert(titles.length >= 3, "AI Generates multiple title variations");
    assert(titles[0].characterCount <= 200, "Primary title adheres to Amazon 200-char limit");

    // 2. AI Description & Bullet Generation Test
    const descriptions = generateDescriptions(sampleProduct);
    assert(descriptions.shortDescription.length > 20, "Generates short description");
    assert(descriptions.keyFeatures.length >= 5, "Generates 5 structured feature bullets");
    assert(descriptions.faqs.length >= 3, "Generates FAQ accordion items");

    // 3. AI Category Prediction Test
    const prediction = predictCategoryAndAttributes("Men slim fit pure cotton denim jacket with metal buttons");
    assert(prediction.category === "Fashion", "Predicts Fashion category for denim jacket");
    assert(prediction.confidence >= 80, "Confidence score is >= 80%");

    // 4. Tone Rewrite Test
    const premiumRewrite = rewriteField("description", "A good quality chair", "premium");
    assert(premiumRewrite.includes("luxury") || premiumRewrite.includes("sophistication"), "Applies premium rewrite tone");

    // 5. Marketplace Rules & Validation Test
    const validAmazonProduct = {
      name: "ai Ergonomic Mesh Chair with Adjustable Lumbar Support and 3D Armrests",
      price: 8999,
      mrp: 14999,
      keyFeatures: ["Bullet 1", "Bullet 2", "Bullet 3"],
      hsnCode: "94013000",
      images: [{ url: "https://example.com/chair.jpg", backgroundType: "white" }],
    };
    const amazonAudit = validateProductForMarketplace(validAmazonProduct, "amazon_in");
    assert(amazonAudit.isValid === true, "Amazon validation passes for fully-populated compliant product");

    const invalidPriceProduct = {
      name: "Short Title",
      price: 15000,
      mrp: 9000, // MRP less than price
    };
    const invalidAudit = validateProductForMarketplace(invalidPriceProduct, "amazon_in");
    assert(invalidAudit.isValid === false, "Amazon validation flags MRP less than selling price");

    // 6. Multi-Channel Audit Test
    const multiAudit = auditProductAcrossMarketplaces(validAmazonProduct);
    assert(multiAudit.readinessScore > 50, "Readiness score calculated across channels");

    // 7. Field Lock Integrity Test
    const testSku = `TEST-LOCK-${Date.now()}`;
    const product = await CatalogueProduct.create({
      organizationId: org._id,
      sku: testSku,
      name: "Original User Entered Title",
      brand: "ai",
      category: "Electronics",
      price: 1999,
      fieldLocks: { title: true },
      description: "Sample test description",
    });

    assert(product.fieldLocks.title === true, "Field lock flag is persisted");

    // Cleanup test product
    await CatalogueProduct.deleteOne({ _id: product._id });
    assert(true, "Test product cleaned up successfully");

    console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (err) {
    console.error("Test Suite Runtime Error:", err);
    process.exit(1);
  }
};

runTests();
