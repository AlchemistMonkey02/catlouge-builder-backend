/**
 * Gemini Studio Shoot Engine (Commented out - AI features disabled)
 * No Gemini API calls will be made.
 */

// Heuristic fallback when no Gemini key is provided or offline
function analyzeHeuristically() {
  return {
    productName: "Artisan Commercial Product",
    category: "Home & Lifestyle",
    primaryMaterial: "Natural Wood & Crafted Elements",
    recommendedStage: "marble",
    lightingTheme: "Warm Luxury Daylight",
    suggestedPrompt: "Commercial macro product photography on polished white Carrara marble countertop, soft morning daylight beam from window, subtle atmospheric rim light, 8k uhd, photorealistic, clean studio",
    adjustments: {
      brightness: 106,
      contrast: 114,
      saturation: 105,
      temperature: 5,
      contactShadowIntensity: 80,
      castShadowIntensity: 42,
      groundReflection: 28,
      productScale: 86,
      offsetY: 16,
    },
    featureBadge: "HANDCRAFTED EXCELLENCE",
    notes: "Calibrated for warm natural materials with luxury marble contact reflection.",
  };
}

/*
async function analyzeAndPlanStudioShoot({ image, apiKey }) {
  // Gemini Vision API cascade disabled
}
*/

async function analyzeAndPlanStudioShoot() {
  return {
    success: false,
    message: "Gemini AI features are disabled.",
    plan: analyzeHeuristically(),
  };
}

function normalizeGeminiKey() {
  return "";
}

module.exports = {
  analyzeAndPlanStudioShoot,
  normalizeGeminiKey,
};
