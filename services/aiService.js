/**
 * AI Catalogue Generation Engine (DISABLED - AI Features removed)
 * All AI and Gemini operations have been commented out.
 */

// Prohibited terms per marketplace guidelines (Amazon, Flipkart, Google Shopping)
const PROHIBITED_SUPERLATIVES = [
  "world's best",
  "cheapest in market",
  "#1 guaranteed",
  "miracle cure",
  "100% cure",
  "free money",
  "unbeatable quality",
];

const sanitizeContent = (text) => {
  if (!text) return "";
  let sanitized = text;
  for (const phrase of PROHIBITED_SUPERLATIVES) {
    const regex = new RegExp(phrase, "gi");
    sanitized = sanitized.replace(regex, "premium quality");
  }
  return sanitized;
};

// Generates multiple distinct title alternatives
const generateTitleVariations = (data, brandName = "ai", tone = "professional") => {
  const name = data.name || data.title || "Premium Product";
  const brand = data.brand || brandName;
  const category = data.category || "General";
  const color = data.color ? ` - ${data.color}` : "";
  const model = data.modelNumber ? ` (${data.modelNumber})` : "";
  const material = data.materialComposition ? `, ${data.materialComposition}` : "";

  return [
    {
      style: "Amazon SEO Standard",
      title: `${brand} ${name}${model}${material}${color} | High Performance & Durable Design`.slice(0, 200),
      characterCount: Math.min(200, `${brand} ${name}${model}${material}${color} | High Performance & Durable Design`.length),
      isSelected: true,
    },
    {
      style: "Flipkart / D2C Punchy",
      title: `${brand} ${name}${color} - Designed for Everyday Reliability`.slice(0, 150),
      characterCount: Math.min(150, `${brand} ${name}${color} - Designed for Everyday Reliability`.length),
      isSelected: false,
    },
    {
      style: "Meesho / Social Commerce Compact",
      title: `${brand} ${name}${color} (Pack of 1)`.slice(0, 100),
      characterCount: Math.min(100, `${brand} ${name}${color} (Pack of 1)`.length),
      isSelected: false,
    },
    {
      style: "Luxury / Brand Focus",
      title: `The ${name} by ${brand}: Exceptional Craftsmanship & Ergonomics`.slice(0, 180),
      characterCount: Math.min(180, `The ${name} by ${brand}: Exceptional Craftsmanship & Ergonomics`.length),
      isSelected: false,
    },
  ];
};

// Generates comprehensive structured product descriptions & bullets
const generateDescriptions = (data, tone = "professional") => {
  const name = data.name || "Product";
  const brand = data.brand || "ai";
  const category = data.category || "General";
  const material = data.materialComposition || "high-grade materials";
  const color = data.color ? ` in ${data.color}` : "";

  const shortDescription = `Experience unmatched performance and design with the ${brand} ${name}${color}. Built with ${material} for maximum durability, style, and everyday comfort.`;

  const detailedDescription = `Upgrade your lifestyle with the ${brand} ${name}. Expertly engineered to combine contemporary aesthetics with robust engineering, this ${category.toLowerCase()} essential delivers seamless functionality whether at home, work, or on the go.\n\nCrafted from ${material}, the product undergoes stringent quality benchmarks to ensure reliable performance and enduring longevity. Its thoughtful ergonomics provide intuitive handling, while the refined finish elevates any setting.\n\nBacked by our comprehensive warranty and dedicated customer care, the ${brand} ${name} represents the perfect blend of innovation, practicality, and enduring value.`;

  const keyFeatures = [
    `SUPERIOR CRAFTSMANSHIP: Engineered with premium ${material} to ensure lasting strength, refined finish, and resistance to everyday wear.`,
    `OPTIMIZED PERFORMANCE: Precision-designed for seamless operation and intuitive usability tailored for ${category.toLowerCase()} enthusiasts.`,
    `SLEEK MODERN AESTHETIC: Minimalist profile with an elegant form factor that complements both professional and personal spaces.`,
    `COMPLETE VALUE PACKAGE: Includes all essential accessories and quick-start instructions for instant, hassle-free setup out of the box.`,
    `RELIABLE ASSURANCE: Thoroughly tested against rigorous safety and quality standards, supported by responsive customer service.`,
  ];

  const faqs = [
    {
      question: `What makes the ${brand} ${name} stand out in its category?`,
      answer: `The ${brand} ${name} combines precision engineering, ${material} build quality, and an ergonomic silhouette for exceptional long-term reliability.`,
    },
    {
      question: `Is this product suitable for daily regular use?`,
      answer: `Yes, it is specifically crafted for high-frequency daily usage and tested to sustain regular wear without degradation.`,
    },
    {
      question: `What is included in the packaging?`,
      answer: `The package contains 1 unit of ${name}, standard accessories, user guide, and manufacturer warranty documentation.`,
    },
  ];

  return {
    shortDescription: sanitizeContent(shortDescription),
    detailedDescription: sanitizeContent(detailedDescription),
    keyFeatures: keyFeatures.map(sanitizeContent),
    faqs,
  };
};

// Generates SEO clusters & marketplace search terms
const generateKeywordsAndSeo = (data) => {
  const name = (data.name || "Product").toLowerCase();
  const brand = (data.brand || "ai").toLowerCase();
  const category = (data.category || "General").toLowerCase();
  const color = data.color ? data.color.toLowerCase() : "";

  const words = name.split(/\s+/).filter((w) => w.length > 2);
  const primaryKeywords = [
    `${brand} ${name}`,
    `best ${category} ${words[0] || ""}`,
    `${name} online`,
    `${brand} ${category}`,
  ];

  const secondaryKeywords = [
    `${category} for daily use`,
    `buy ${name} ${color}`.trim(),
    `${brand} genuine warranty`,
    `high quality ${words[0] || category}`,
  ];

  const longTail = [
    `where to buy genuine ${brand} ${name}`,
    `affordable ${category} with warranty and fast delivery`,
    `${brand} ${name} reviews specifications and price`,
  ];

  const searchTerms = [
    brand,
    ...words,
    category,
    color,
    "durable",
    "premium",
    "lifestyle",
    "online",
  ].filter(Boolean);

  const metaTitle = `${data.brand || "ai"} ${data.name || "Product"} - Official Store | Buy Online`.slice(0, 60);
  const metaDescription = `Shop genuine ${data.brand || "ai"} ${data.name || "Product"}. Fast shipping, manufacturer warranty, and best prices on our authorized store.`.slice(0, 160);

  return {
    keywords: {
      primary: Array.from(new Set(primaryKeywords)),
      secondary: Array.from(new Set(secondaryKeywords)),
      longTail: Array.from(new Set(longTail)),
      searchTerms: Array.from(new Set(searchTerms)).slice(0, 15),
    },
    seo: {
      metaTitle,
      metaDescription,
      slug: (data.name || "product")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    },
  };
};

// Predicts product category and attributes
const predictCategoryAndAttributes = (rawText) => {
  const text = (rawText || "").toLowerCase();
  let category = "Electronics";
  let subcategory = "Accessories";
  let productType = "Consumer Device";
  let confidence = 88;

  if (text.includes("shirt") || text.includes("dress") || text.includes("shoe") || text.includes("pant") || text.includes("cotton") || text.includes("fabric") || text.includes("jacket")) {
    category = "Fashion";
    subcategory = "Apparel & Accessories";
    productType = "Wearable";
    confidence = 94;
  } else if (text.includes("cook") || text.includes("kitchen") || text.includes("sofa") || text.includes("lamp") || text.includes("bed") || text.includes("cushion") || text.includes("table")) {
    category = "Home";
    subcategory = "Kitchen & Living";
    productType = "Home Decor";
    confidence = 91;
  } else if (text.includes("gym") || text.includes("yoga") || text.includes("ball") || text.includes("fitness") || text.includes("running") || text.includes("cycle")) {
    category = "Sports";
    subcategory = "Fitness & Outdoors";
    productType = "Sports Gear";
    confidence = 89;
  } else if (text.includes("book") || text.includes("novel") || text.includes("author") || text.includes("paperback") || text.includes("edition")) {
    category = "Books";
    subcategory = "Publications";
    productType = "Print Media";
    confidence = 96;
  }

  // Extract common attributes
  const detectedSpecs = [];
  const colorMatch = text.match(/\b(black|white|blue|red|green|yellow|silver|gold|grey|brown)\b/i);
  const materialMatch = text.match(/\b(leather|cotton|plastic|aluminum|steel|wood|polyester|glass|ceramic|silicone)\b/i);

  if (colorMatch) {
    detectedSpecs.push({ key: "Color", value: colorMatch[0].toUpperCase(), verified: false });
  }
  if (materialMatch) {
    detectedSpecs.push({ key: "Material", value: materialMatch[0].toUpperCase(), verified: false });
  }
  detectedSpecs.push({ key: "Country of Origin", value: "India", verified: true });
  detectedSpecs.push({ key: "Warranty", value: "1 Year", verified: true });

  return {
    category,
    subcategory,
    productType,
    confidence,
    detectedSpecs,
    missingFields: ["HSN Code", "Dimensions", "Weight"],
  };
};

// Rewrites single field in specified tone
const rewriteField = (fieldName, currentText, tone = "professional", context = {}) => {
  const prefix = {
    professional: "Engineered with precision for peak operational standards: ",
    premium: "An exquisite embodiment of luxury, sophistication, and timeless form: ",
    minimal: "Essential, clean, and functional: ",
    seo_focused: `High-performance ${context.category || "product"} optimized for durability, value, and everyday utility: `,
    feature_focused: "Highlighting key performance advantages, high-grade composition, and intuitive ergonomics: ",
    conversion_focused: "Don't settle for ordinary—experience unmatched value, rapid delivery, and proven satisfaction: ",
    marketplace_compliant: "Compliant with marketplace quality benchmarks: ",
    brand_specific: `Crafted to uphold ${context.brand || "ai"}'s benchmark of excellence and integrity: `,
  };

  const cleanCurrent = (currentText || "").trim();
  const intro = prefix[tone] || prefix.professional;

  if (fieldName === "description") {
    return `${intro}${cleanCurrent.length > 20 ? cleanCurrent : "Delivers peerless functionality, modern styling, and long-lasting durability for discerning users."}`;
  }

  if (fieldName === "shortDescription") {
    return `${intro}${cleanCurrent.slice(0, 160)}`;
  }

  if (fieldName === "title") {
    const brand = context.brand || "ai";
    return `${brand} ${cleanCurrent} [${tone.toUpperCase().replace("_", " ")} Edition]`.slice(0, 180);
  }

  return cleanCurrent;
};

module.exports = {
  generateTitleVariations,
  generateDescriptions,
  generateKeywordsAndSeo,
  predictCategoryAndAttributes,
  rewriteField,
};
