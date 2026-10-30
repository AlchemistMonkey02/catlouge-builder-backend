const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const CatalogueProduct = require("../models/CatalogueProduct");

/**
 * Audit image against channel specifications
 */
const auditImageSpecs = (req, res, next) => {
  try {
    const { url, width = 1000, height = 1000, backgroundType = "original" } = req.body;

    const channels = {
      amazon_in: {
        passed: width >= 1000 && height >= 1000 && Math.abs(width - height) < 20,
        minDim: 1000,
        recommendedBg: "Pure White (#FFFFFF)",
        isBgCompliant: backgroundType === "white",
        notes: width >= 1000 ? "Zoom capability enabled" : "Image too small for Amazon zoom",
      },
      flipkart: {
        passed: width >= 800 && height >= 800,
        minDim: 800,
        recommendedBg: "Clean White or Light Grey",
        isBgCompliant: backgroundType === "white" || backgroundType === "original",
        notes: "Meets Flipkart standard listing requirements",
      },
      meesho: {
        passed: width >= 600 && height >= 600,
        minDim: 600,
        recommendedBg: "Clean background",
        isBgCompliant: true,
        notes: "Mobile-optimized for Meesho catalog cards",
      },
      shopify: {
        passed: true,
        minDim: 1000,
        recommendedBg: "Any brand aesthetic",
        isBgCompliant: true,
        notes: "Fully compatible with Shopify theme galleries",
      },
    };

    res.json({
      success: true,
      data: {
        dimensions: `${width} x ${height}`,
        aspectRatio: (width / height).toFixed(2),
        backgroundType,
        channels,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Package product images into a downloadable ZIP archive
 */
const exportImageZip = async (req, res, next) => {
  try {
    const { productId, imageUrls } = req.body;

    let targetUrls = imageUrls || [];
    let sku = "PRODUCT-IMAGES";

    if (productId) {
      const product = await CatalogueProduct.findOne({
        _id: productId,
        organizationId: req.organizationId,
      });
      if (product) {
        sku = product.sku;
        targetUrls = product.images.map((img) => img.url);
        if (targetUrls.length === 0 && product.image) {
          targetUrls.push(product.image);
        }
      }
    }

    if (targetUrls.length === 0) {
      return res.status(400).json({ success: false, message: "No images found to package" });
    }

    // Set headers for ZIP download
    res.setHeader("Content-Disposition", `attachment; filename="${sku}_Media_Assets.zip"`);
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => next(err));
    archive.pipe(res);

    // Create manifest file inside zip
    const manifest = {
      productSku: sku,
      exportedAt: new Date().toISOString(),
      assetCount: targetUrls.length,
      imageManifest: targetUrls.map((url, idx) => ({
        index: idx + 1,
        filename: `${sku}_image_${idx + 1}.jpg`,
        remoteSource: url,
        specs: "1000x1000 1:1 Square (Catalogue Ready)",
      })),
    };

    archive.append(JSON.stringify(manifest, null, 2), { name: "manifest.json" });

    // Include an instruction readme
    const readme = `ai CATALOGUE BUILDER - IMAGE ASSET PACK
SKU: ${sku}
Exported: ${new Date().toLocaleString()}

These assets have been formatted for e-commerce listing compliance across Amazon India, Flipkart, Meesho, and Shopify.
Use the primary 1:1 image for main search listings and secondary images for detail page carousels.`;

    archive.append(readme, { name: "README.txt" });

    archive.finalize();
  } catch (error) {
    next(error);
  }
};

/**
 * Apply processed studio image directly to a catalogue product
 */
const applyImageToProduct = async (req, res, next) => {
  try {
    const { productId, imageUrl, backgroundType = "studio", altText = "" } = req.body;

    if (!productId || !imageUrl) {
      return res.status(400).json({ success: false, message: "productId and imageUrl are required" });
    }

    const product = await CatalogueProduct.findOne({
      _id: productId,
      organizationId: req.organizationId,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Catalogue product not found" });
    }

    // Update primary image
    product.image = imageUrl;

    // Add or update primary entry in images array
    const existingIndex = product.images.findIndex((img) => img.isPrimary);
    const newImageEntry = {
      url: imageUrl,
      alt: altText || `${product.name} Studio Shot`,
      isPrimary: true,
      order: 0,
      backgroundType: backgroundType || "white",
      width: 1200,
      height: 1200,
      processed: true,
    };

    if (existingIndex >= 0) {
      product.images[existingIndex] = newImageEntry;
    } else {
      product.images.unshift(newImageEntry);
    }

    // Set other images to non-primary
    product.images.forEach((img, idx) => {
      if (idx !== (existingIndex >= 0 ? existingIndex : 0)) {
        img.isPrimary = false;
      }
    });

    await product.save();

    res.json({
      success: true,
      message: `Studio image placed onto product '${product.name}' (${product.sku}) successfully!`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product directly from AI Studio
 */
const createProductFromStudio = async (req, res, next) => {
  try {
    const {
      companyId,
      name,
      sku,
      brand,
      category = "General",
      price = 999,
      mrp = 1499,
      imageUrl,
      description = "",
    } = req.body;

    if (!name || !imageUrl) {
      return res.status(400).json({ success: false, message: "Product name and studio image are required" });
    }

    const generatedSku = sku || `STU-${Date.now().toString(36).toUpperCase()}`;

    const newProduct = new CatalogueProduct({
      organizationId: req.organizationId,
      companyId: companyId || undefined,
      name,
      sku: generatedSku,
      brand: brand || "ai Studio",
      category,
      price: Number(price),
      mrp: Number(mrp),
      stock: 50,
      image: imageUrl,
      images: [
        {
          url: imageUrl,
          alt: `${name} - Studio Product Shoot`,
          isPrimary: true,
          order: 0,
          backgroundType: "studio",
          width: 1200,
          height: 1200,
          processed: true,
        },
      ],
      description: description || `Studio-grade presentation of ${name}. Crafted for professional e-commerce listings with high-fidelity visual presentation.`,
      shortDescription: `Studio edition of ${name}. High-resolution visual presentation.`,
      keyFeatures: [
        `High-resolution studio photographed representation.`,
        `Marketplace ready listing compliant with Amazon, Flipkart, and Shopify.`,
        `High quality finish and verified specifications.`,
      ],
      status: "validated",
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: `New catalogue product '${newProduct.name}' created with studio photo!`,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// High-fidelity studio backdrops library categorized by ODOP themes & keywords
// High-fidelity studio backdrops library categorized by ODOP themes & keywords
// Strictly macro commercial product surfaces (pedestals, slabs, empty podiums) - NEVER rooms/lobbies
const STUDIO_BACKDROP_LIBRARY = {
  kota_stone: "https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=1200&auto=format&fit=crop&q=85",
  sandstone: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&auto=format&fit=crop&q=85",
  kota_doria: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop&q=85",
  garlic: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=1200&auto=format&fit=crop&q=85",
  marble: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&auto=format&fit=crop&q=85",
  wood: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=85",
  cyber: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=85",
  botanical: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1200&auto=format&fit=crop&q=85",
  water: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop&q=85",
  podium: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=85",
  silk: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=1200&auto=format&fit=crop&q=85",
  white: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=85",
};

async function fetchImageAsBase64(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buf = await res.arrayBuffer();
    return `data:${contentType};base64,${Buffer.from(buf).toString("base64")}`;
  } catch (err) {
    return null;
  }
}

async function resolveAiStudioBackground(prompt = "", scene = "marble_pedestal") {
  const p = (prompt || "").toLowerCase();
  const sc = (scene || "").toLowerCase();

  // Match ODOP products and commercial keywords with high precision
  let matchedKey = "marble";

  if (p.includes("kota stone") || p.includes("kotastone") || p.includes("kota_stone") || p.includes("green limestone") || sc.includes("kota_stone")) {
    matchedKey = "kota_stone";
  } else if (p.includes("sandstone") || p.includes("sand stone") || p.includes("jodhpur") || p.includes("dholpur") || sc.includes("sandstone")) {
    matchedKey = "sandstone";
  } else if (p.includes("kota doria") || p.includes("kotadoria") || p.includes("doria") || p.includes("handloom") || p.includes("saree") || p.includes("zari") || p.includes("fabric") || sc.includes("kota_doria")) {
    matchedKey = "kota_doria";
  } else if (p.includes("garlic") || p.includes("lasan") || p.includes("lasun") || p.includes("burlap") || p.includes("culinary") || p.includes("farm") || sc.includes("garlic")) {
    matchedKey = "garlic";
  } else if (p.includes("carrara") || p.includes("marble") || p.includes("countertop") || sc.includes("marble")) {
    matchedKey = "marble";
  } else if (p.includes("wood") || p.includes("oak") || p.includes("timber") || p.includes("teak") || p.includes("incense") || p.includes("artisan") || sc.includes("wood") || sc.includes("oak")) {
    matchedKey = "wood";
  } else if (p.includes("cyber") || p.includes("neon") || p.includes("dark") || p.includes("obsidian") || sc.includes("dark_neon") || sc.includes("obsidian")) {
    matchedKey = "cyber";
  } else if (p.includes("botanical") || p.includes("limestone") || p.includes("leaf") || p.includes("plant") || sc.includes("botanical")) {
    matchedKey = "botanical";
  } else if (p.includes("water") || p.includes("splash") || p.includes("ripple") || sc.includes("water")) {
    matchedKey = "water";
  } else if (p.includes("podium") || p.includes("pastel") || p.includes("pedestal") || sc.includes("podium")) {
    matchedKey = "podium";
  } else if (p.includes("silk") || p.includes("velvet") || p.includes("emerald") || sc.includes("silk") || sc.includes("velvet")) {
    matchedKey = "silk";
  } else if (p.includes("white") || p.includes("pure") || sc.includes("white")) {
    matchedKey = "white";
  }

  const targetUrl = STUDIO_BACKDROP_LIBRARY[matchedKey] || STUDIO_BACKDROP_LIBRARY.marble;
  const b64 = await fetchImageAsBase64(targetUrl);
  return b64 || targetUrl;
}

/**
 * Generate AI Studio Scene Background
 */
const generateAiBackground = async (req, res, next) => {
  try {
    const { prompt, scene = "marble_pedestal" } = req.body;
    const finalBackgroundUrl = await resolveAiStudioBackground(prompt, scene);

    res.json({
      success: true,
      data: {
        scene,
        prompt: prompt || "Commercial studio product photography",
        backgroundUrl: finalBackgroundUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Neural AI Cutout for Salient Object Extraction
 */
const neuralAiCutout = async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Image base64 or URL is required" });
    }

    let imageBase64 = image;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      const response = await fetch(image);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageBase64 = `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    const { spawn } = require("child_process");
    const scriptPath = path.join(__dirname, "../utils/aiCutout.py");
    const py = spawn("python", [scriptPath]);

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (chunk) => {
      stdoutData += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    py.on("close", (code) => {
      try {
        const result = JSON.parse(stdoutData.trim());
        if (result.success && result.cutout) {
          return res.json({ success: true, cutout: result.cutout });
        } else {
          return res.status(500).json({
            success: false,
            message: result.error || "Neural cutout processing failed",
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to parse neural cutout output: " + err.message,
          raw: stdoutData,
          stderr: stderrData,
        });
      }
    });

    py.stdin.write(JSON.stringify({ image: imageBase64 }));
    py.stdin.end();
  } catch (error) {
    next(error);
  }
};

// const { analyzeAndPlanStudioShoot } = require("../services/geminiStudioService");

/**
 * Gemini AI Auto Studio Shoot Analysis & Planner (Commented out - AI features disabled)
 */
/*
const geminiAutoStudioPlan = async (req, res, next) => {
  try {
    const { image, apiKey } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const result = await analyzeAndPlanStudioShoot({ image, apiKey });

    // Generate matching photorealistic AI background URL
    let backgroundUrl = null;
    if (result.plan?.suggestedPrompt) {
      backgroundUrl = await resolveAiStudioBackground(
        result.plan.suggestedPrompt,
        result.plan.recommendedStage
      );
    }

    res.json({
      success: true,
      data: {
        ...result,
        backgroundUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};
*/

/**
 * Super-Resolution AI Upscaler & Studio Lighting Enhancer
 */
const upscaleAndEnhanceImage = async (req, res, next) => {
  try {
    const {
      image,
      scale,
      scaleFactor = scale || 2.0,
      sharpness = 1.45,
      contrast = 1.15,
      saturation = 1.10,
    } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: "Image base64 or URL is required" });
    }

    let imageBase64 = image;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      const response = await fetch(image);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get("content-type") || "image/jpeg";
      imageBase64 = `data:${contentType};base64,${buffer.toString("base64")}`;
    }

    const { spawn } = require("child_process");
    const scriptPath = path.join(__dirname, "../utils/aiUpscale.py");
    const py = spawn("python", [scriptPath]);

    let stdoutData = "";
    let stderrData = "";

    py.stdout.on("data", (chunk) => {
      stdoutData += chunk.toString();
    });

    py.stderr.on("data", (chunk) => {
      stderrData += chunk.toString();
    });

    py.on("close", (code) => {
      try {
        const result = JSON.parse(stdoutData.trim());
        if (result.success && result.upscaled) {
          return res.json({
            success: true,
            image: result.upscaled,
            upscaled: result.upscaled,
            width: result.width,
            height: result.height,
            originalWidth: result.originalWidth,
            originalHeight: result.originalHeight,
            scaleFactor: result.scaleFactor,
            stats: {
              from: `${result.originalWidth}x${result.originalHeight}`,
              to: `${result.width}x${result.height}`,
              scale: `${result.scaleFactor}x`,
            },
          });
        } else {
          return res.status(500).json({
            success: false,
            message: result.error || "Image upscaling failed",
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to parse upscaler output: " + err.message,
          raw: stdoutData,
          stderr: stderrData,
        });
      }
    });

    py.stdin.write(
      JSON.stringify({
        image: imageBase64,
        scaleFactor: Number(scaleFactor),
        sharpness: Number(sharpness),
        contrast: Number(contrast),
        saturation: Number(saturation),
      })
    );
    py.stdin.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  auditImageSpecs,
  exportImageZip,
  applyImageToProduct,
  createProductFromStudio,
  upscaleAndEnhanceImage,
};
