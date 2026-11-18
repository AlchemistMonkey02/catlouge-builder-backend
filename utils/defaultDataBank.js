/**
 * Default Industry Data Bank Generator (Server)
 * Generates rich pre-filled marketing copy (headings, taglines, paragraphs, bullets)
 * and technical specifications (thickness, sizes, finishes, materials, applications, MOQs, price ranges)
 * for companies based faithfully on their authentic category, cataloged products, and country/district.
 */

function resolveCompanyCategory(company, products = []) {
  const odop = (company?.odopProduct || "").toLowerCase();
  const ind = (company?.industry || "").toLowerCase();
  const name = (company?.name || "").toLowerCase();
  const dist = (company?.district || "").toLowerCase();
  const addr = (company?.contact?.address || "").toLowerCase();

  const prodList = Array.isArray(products) ? products : [];
  const prodText = prodList
    .map((p) => `${p.name || ""} ${p.category || ""} ${p.description || ""} ${p.material || ""}`)
    .join(" ")
    .toLowerCase();

  const combined = `${odop} ${ind} ${name} ${prodText}`;

  // PRIORITY 1: KOTA DORIA / TEXTILES / SAREES / HANDLOOMS
  if (
    combined.includes("doria") ||
    combined.includes("saree") ||
    combined.includes("handloom") ||
    combined.includes("textil") ||
    combined.includes("fabric") ||
    combined.includes("threads") ||
    combined.includes("weaver") ||
    combined.includes("zari") ||
    combined.includes("dupatta") ||
    combined.includes("chanderi") ||
    combined.includes("apparel")
  ) {
    return "kotadoria";
  }

  // PRIORITY 2: GARLIC / AGRO / PRODUCE / SPICES
  if (
    combined.includes("garlic") ||
    combined.includes("lahsun") ||
    combined.includes("clove") ||
    combined.includes("agro") ||
    combined.includes("produce") ||
    combined.includes("spices") ||
    combined.includes("mandi") ||
    combined.includes("crop")
  ) {
    return "garlic";
  }

  // PRIORITY 3: SANDSTONE / QUARTZITE / FACADES
  if (
    combined.includes("sandstone") ||
    combined.includes("sand stone") ||
    combined.includes("quartzite") ||
    combined.includes("dholpur") ||
    combined.includes("jali") ||
    (combined.includes("facade") && !combined.includes("limestone"))
  ) {
    return "sandstone";
  }

  // PRIORITY 4: KOTA STONE / LIMESTONE / QUARRY SLABS
  if (
    combined.includes("kota stone") ||
    combined.includes("limestone") ||
    combined.includes("natural stone") ||
    combined.includes("granite") ||
    combined.includes("quarry") ||
    combined.includes("stone")
  ) {
    return "kotastone";
  }

  // PRIORITY 5: LOCATION / DISTRICT FALLBACK (Only if explicit keywords above are absent)
  const loc = `${dist} ${addr}`;
  if (loc.includes("baran") || loc.includes("mandsaur")) return "garlic";
  if (loc.includes("bundi") || loc.includes("jodhpur")) return "sandstone";
  if (loc.includes("jhalawar") || loc.includes("suket") || loc.includes("ramganj")) return "kotastone";
  if (loc.includes("kota") || loc.includes("kaithun")) return "kotadoria";

  return "general";
}

function resolveCompanyLocation(company) {
  const addr = (company?.contact?.address || "").toLowerCase();
  const dist = (company?.district || "").trim();
  const state = (company?.state || "").trim();
  const rawCountry = (company?.country || company?.contact?.country || "").trim();
  const rawCurrency = (company?.legal?.currency || company?.currency || "").toUpperCase();

  let country = rawCountry;
  if (!country) {
    if (addr.includes("usa") || addr.includes("united states") || addr.includes("ny") || addr.includes("california")) country = "United States";
    else if (addr.includes("uk") || addr.includes("united kingdom") || addr.includes("london")) country = "United Kingdom";
    else if (addr.includes("uae") || addr.includes("dubai") || addr.includes("abu dhabi")) country = "United Arab Emirates";
    else if (addr.includes("germany") || addr.includes("deutschland")) country = "Germany";
    else if (addr.includes("australia") || addr.includes("sydney")) country = "Australia";
    else country = "India";
  }

  let currSym = "₹";
  let currCode = "INR";
  if (rawCurrency === "USD" || country === "United States") {
    currSym = "$";
    currCode = "USD";
  } else if (rawCurrency === "EUR" || country === "Germany") {
    currSym = "€";
    currCode = "EUR";
  } else if (rawCurrency === "GBP" || country === "United Kingdom") {
    currSym = "£";
    currCode = "GBP";
  } else if (rawCurrency === "AED" || country === "United Arab Emirates") {
    currSym = "AED ";
    currCode = "AED";
  } else if (rawCurrency) {
    currCode = rawCurrency;
    currSym = rawCurrency === "INR" ? "₹" : `${rawCurrency} `;
  }

  const parts = [dist, state, country !== "India" ? country : ""].filter(Boolean);
  return {
    country,
    state,
    district: dist,
    currencySymbol: currSym,
    currencyCode: currCode,
    locationDisplay: parts.join(", ") || country || "Verified Region"
  };
}

function getDefaultDataBank(company, products = []) {
  const family = resolveCompanyCategory(company, products);
  const loc = resolveCompanyLocation(company);
  const brandName = company?.name || "Authentic Enterprise";
  const brandTagline = company?.tagline || "Certified Authentic Collection";
  const sym = loc.currencySymbol;

  if (family === "kotastone") {
    return {
      version: 1,
      family: "kotastone",
      companyName: brandName,
      location: loc.locationDisplay,
      currency: loc.currencyCode,
      headings: [
        { id: "h1", text: `${brandName} Royal Kota Stone & Limestone`, category: "Cover / Title" },
        { id: "h2", text: "Machine Cut Gauged Limestone Flooring", category: "Section Title" },
        { id: "h3", text: "Mirror High Polish Architectural Slabs", category: "Product Hero" },
        { id: "h4", text: "Quarry Provenance: Suket & Ramganj Mandi", category: "Provenance" },
        { id: "h5", text: "Natural Indurated Limestone Architectural Collection", category: "Lookbook Title" }
      ],
      taglines: [
        { id: "t1", text: brandTagline || "Natural • Durable • Timeless" },
        { id: "t2", text: "Naturally cool underfoot, non-porous, and wear resistant" },
        { id: "t3", text: "Direct quarry extraction with machine diamond calibration" },
        { id: "t4", text: "High compressive strength (>110 MPa) for commercial corridors" }
      ],
      paragraphs: [
        {
          id: "p1",
          title: "About Our Kota Stone Quarry",
          category: "Brand Story",
          text: `Quarried directly from Ramganj Mandi and Suket basin, ${brandName}'s natural indurated limestone features ultra-high compressive strength, uniform machine-sawn calibration, and naturally cool surface underfoot.`
        },
        {
          id: "p2",
          title: "Technical Excellence & Zero Porosity",
          category: "Technical",
          text: "With a water absorption rate under 0.45%, our Kota Stone slabs outperform conventional ceramic tiles in durability, providing an abrasion-proof surface ideal for heavy traffic railway concourses, hospitals, and heritage estates."
        },
        {
          id: "p3",
          title: "Precision Mirror Polish & Sawn Edges",
          category: "Process",
          text: "Using multi-head gangsaw diamond cutters and multi-stage polishing lines, each slab achieves mirror-flat finish with rectified square edges for hairline grout installations."
        }
      ],
      featureHighlights: [
        { id: "f1", text: "Non-porous, naturally cool underfoot, and non-slip surface in wet conditions" },
        { id: "f2", text: "Extremely high compressive strength exceeding 140 MPa for lifetime endurance" },
        { id: "f3", text: "Uniform gauged thickness (20-25mm & 25-30mm) for seamless floor leveling" },
        { id: "f4", text: "Resistant to grease, oil, and commercial detergents without discoloration" },
        { id: "f5", text: "100% natural quarried limestone conforming to statutory architectural benchmarks" }
      ],
      specifications: {
        thicknesses: [
          {
            value: "20 - 25 mm Gauged",
            chipLabel: "20-25mm Gauged",
            label: `20 - 25 mm Gauged (Standard Flooring) — ${sym}65 / sq.ft`,
            price: 65,
            mrp: 95,
            priceRange: `${sym}55 – ${sym}85 / sq.ft`
          },
          {
            value: "25 - 30 mm Calibrated",
            chipLabel: "25-30mm Calibrated",
            label: `25 - 30 mm Calibrated (Heavy Paving) — ${sym}95 / sq.ft`,
            price: 95,
            mrp: 135,
            priceRange: `${sym}85 – ${sym}120 / sq.ft`
          },
          {
            value: "15 - 18 mm Commercial Polish",
            chipLabel: "15-18mm Polish",
            label: `15 - 18 mm Commercial Polish (Lightweight) — ${sym}48 / sq.ft`,
            price: 48,
            mrp: 70,
            priceRange: `${sym}45 – ${sym}60 / sq.ft`
          },
          {
            value: "30 - 35 mm Heavy Slabs",
            chipLabel: "30-35mm Slabs",
            label: `30 - 35 mm Heavy Slabs (Industrial Traffic) — ${sym}125 / sq.ft`,
            price: 125,
            mrp: 175,
            priceRange: `${sym}115 – ${sym}155 / sq.ft`
          },
          {
            value: "40 - 50 mm Quarry Paver",
            chipLabel: "40-50mm Paver",
            label: `40 - 50 mm Quarry Paver (High Duty Ramp) — ${sym}165 / sq.ft`,
            price: 165,
            mrp: 220,
            priceRange: `${sym}150 – ${sym}195 / sq.ft`
          }
        ],
        sizes: [
          { value: "2×2 ft (600×600 mm)", chipLabel: "2×2 ft (600mm)", label: "2×2 ft (600×600 mm) — Standard Sawn Tile" },
          { value: "2×1 ft (600×300 mm)", chipLabel: "2×1 ft (600×300)", label: "2×1 ft (600×300 mm) — Rectangular Tile" },
          { value: "22×22 inch (560×560 mm)", chipLabel: "22×22 in", label: "22×22 inch (560×560 mm) — Commercial Size" },
          { value: "17×23 inch (430×580 mm)", chipLabel: "17×23 in", label: "17×23 inch (430×580 mm) — Pre-cut Tile" },
          { value: "2×4 ft (600×1200 mm Grand Slab)", chipLabel: "2×4 ft Grand", label: "2×4 ft (600×1200 mm) — Grand Gangsaw Slab" },
          { value: "1×1 ft (300×300 mm Small Paver)", chipLabel: "1×1 ft Paver", label: "1×1 ft (300×300 mm) — Compact Paver" }
        ],
        finishes: [
          { value: "Mirror High Polish / Honed", chipLabel: "Mirror Polish", label: "Mirror High Polish (Diamond Machine Honed)" },
          { value: "Honed Satin Smooth / Machine Cut", chipLabel: "Honed Satin", label: "Honed Satin Smooth / Machine Cut Square Edge" },
          { value: "River Washed / Flamed Texture", chipLabel: "River Washed", label: "River Washed / Flamed Non-Slip Textured" },
          { value: "Shot Blasted Anti-Skid Surface", chipLabel: "Shot Blasted", label: "Shot Blasted / Bush Hammered Anti-Skid" },
          { value: "Hand-Chiseled Natural Split Face", chipLabel: "Hand-Chiseled", label: "Hand-Chiseled Natural Split Quarry Face" }
        ],
        materials: [
          { value: "Natural Indurated Limestone / Heavy Commercial Flooring", chipLabel: "Limestone Flooring", label: "Natural Indurated Limestone / Commercial Flooring & Corridors" },
          { value: "Kota Blue-Green Limestone / Patios & Pathways", chipLabel: "Patios & Pathways", label: "Kota Blue-Green Limestone / Patios & Landscaping" },
          { value: "Brown Kota Limestone / Premium Living & Wall Cladding", chipLabel: "Brown Kota", label: "Brown Kota Limestone / Premium Living & Cladding" }
        ],
        applications: [
          { value: "Heavy Traffic Commercial & Institutional Flooring", chipLabel: "Commercial Corridors", label: "Heavy Traffic Commercial & Institutional Flooring" },
          { value: "Exterior Driveways, Pathways & Landscape Paving", chipLabel: "Driveways & Pathways", label: "Exterior Driveways, Pathways & Landscape Paving" },
          { value: "Industrial Corridors, Warehouses & Railway Platforms", chipLabel: "Industrial Platforms", label: "Industrial Corridors, Warehouses & Railway Platforms" }
        ],
        moqs: [
          { value: "500 sq.ft (Quarry Lot)", chipLabel: "500 sq.ft", label: "500 sq.ft (Standard Quarry Lot)" },
          { value: "1 Truckload (12,000 sq.ft)", chipLabel: "1 Truckload", label: "1 Truckload (12,000 sq.ft Bulk Lot)" },
          { value: "2,000 sq.ft (Commercial Project)", chipLabel: "2,000 sq.ft", label: "2,000 sq.ft (Commercial Project Lot)" }
        ],
        priceRanges: [
          { value: `${sym}55 – ${sym}95 / sq.ft`, chipLabel: `${sym}55-95`, label: `${sym}55 – ${sym}95 / sq.ft (Economy Polish)` },
          { value: `${sym}85 – ${sym}140 / sq.ft`, chipLabel: `${sym}85-140`, label: `${sym}85 – ${sym}140 / sq.ft (Calibrated Heavy)` },
          { value: `${sym}125 – ${sym}195 / sq.ft`, chipLabel: `${sym}125-195`, label: `${sym}125 – ${sym}195 / sq.ft (Grand Gangsaw Slabs)` }
        ]
      }
    };
  }

  if (family === "sandstone") {
    return {
      version: 1,
      family: "sandstone",
      companyName: brandName,
      location: loc.locationDisplay,
      currency: loc.currencyCode,
      headings: [
        { id: "h1", text: `${brandName} Royal Sandstone & Facades`, category: "Cover / Title" },
        { id: "h2", text: "Imperial Desert Gold & Bundi Red Sandstone", category: "Section Title" },
        { id: "h3", text: "Architectural Sawn Cladding & Landscape Paving", category: "Product Hero" },
        { id: "h4", text: "Heritage Carved Jali & Facade Masonry", category: "Artisan Title" }
      ],
      taglines: [
        { id: "t1", text: brandTagline || "Sedimentary Quartz Sandstone Mining & Architectural Cladding" },
        { id: "t2", text: "Weather-proof sedimentary sandstone carved for royal heritage architecture" },
        { id: "t3", text: "High compressive strength (>110 MPa) with zero thermal fading" }
      ],
      paragraphs: [
        {
          id: "p1",
          title: "Quarry Extraction & Geology",
          category: "Brand Story",
          text: `Extracted from the certified sandstone belts of Bundi and Jodhpur, ${brandName}'s natural quartzite sandstones offer timeless earthy aesthetics, high mechanical shear strength, and unmatched resilience against extreme weathering.`
        },
        {
          id: "p2",
          title: "Architectural Facades & Paving",
          category: "Applications",
          text: "Ideal for grand exterior building facades, ventilated curtain walls, heritage jali screens, perimeter wall copings, and patio landscaping across climatic extremes."
        }
      ],
      featureHighlights: [
        { id: "f1", text: "High silica quartzite composition resistant to acid rain, frost, and UV sun fading" },
        { id: "f2", text: "Naturally slip-resistant texture ideal for wet pool surrounds, terraces, and garden walkways" },
        { id: "f3", text: "Thermal insulating properties keeping interiors cool in tropical climates" },
        { id: "f4", text: "Precision machine-cut edges for crisp geometric masonry and minimal mortar joints" }
      ],
      specifications: {
        thicknesses: [
          {
            value: "25 - 30 mm Calibrated",
            chipLabel: "25-30mm Calibrated",
            label: `25 - 30 mm Calibrated (Standard Paving) — ${sym}140 / sq.ft`,
            price: 140,
            mrp: 190,
            priceRange: `${sym}125 – ${sym}170 / sq.ft`
          },
          {
            value: "18 - 20 mm Sawn Cladding",
            chipLabel: "18-20mm Cladding",
            label: `18 - 20 mm Sawn Cladding (Lightweight Wall) — ${sym}110 / sq.ft`,
            price: 110,
            mrp: 150,
            priceRange: `${sym}95 – ${sym}130 / sq.ft`
          },
          {
            value: "35 - 40 mm Heavy Landscape",
            chipLabel: "35-40mm Landscape",
            label: `35 - 40 mm Heavy Landscape Pavers — ${sym}185 / sq.ft`,
            price: 185,
            mrp: 250,
            priceRange: `${sym}165 – ${sym}220 / sq.ft`
          },
          {
            value: "50 mm Heritage Cut Slabs",
            chipLabel: "50mm Heritage",
            label: `50 mm Architectural Heritage Steps & Slabs — ${sym}240 / sq.ft`,
            price: 240,
            mrp: 320,
            priceRange: `${sym}220 – ${sym}290 / sq.ft`
          }
        ],
        sizes: [
          { value: "2×2 ft (600×600 mm)", chipLabel: "2×2 ft (600mm)", label: "2×2 ft (600×600 mm) — Standard Sawn Tile" },
          { value: "600×900 mm Architectural Slab", chipLabel: "600×900 mm", label: "600×900 mm — Large Format Architectural Slab" },
          { value: "2×1 ft (600×300 mm)", chipLabel: "2×1 ft", label: "2×1 ft (600×300 mm) — Facade Wall Tile" },
          { value: "Custom Carved Jali Screen Panel (3×4 ft)", chipLabel: "3×4 ft Jali", label: "Custom Carved Jali Screen Panel (3×4 ft)" },
          { value: "1×1 ft (300×300 mm Paver)", chipLabel: "1×1 ft Paver", label: "1×1 ft (300×300 mm) — Landscape Paver" }
        ],
        finishes: [
          { value: "Sandblasted / Honed Satin", chipLabel: "Sandblasted", label: "Sandblasted / Honed Satin Matte" },
          { value: "Hand-Chiseled Rock Face / Chamfered", chipLabel: "Hand-Chiseled", label: "Hand-Chiseled Natural Rock Face" },
          { value: "Diamond Sawn Smooth Surface", chipLabel: "Diamond Sawn", label: "Diamond Sawn Smooth Surface" },
          { value: "Flamed Non-Slip / River Texture", chipLabel: "Flamed", label: "Flamed Non-Slip River Wash" }
        ],
        materials: [
          { value: "Natural Quartzite Sandstone / High Traffic Flooring & Facades", chipLabel: "Quartzite Facades", label: "Natural Quartzite Sandstone / High Traffic Flooring & Facades" },
          { value: "Dholpur Beige Sandstone / Exterior Cladding & Jali", chipLabel: "Dholpur Beige", label: "Dholpur Beige Sandstone / Exterior Cladding & Jali" },
          { value: "Jodhpur Pink / Red Sandstone / Fort Architecture", chipLabel: "Jodhpur Sandstone", label: "Jodhpur Pink / Red Sandstone / Fort Architecture" }
        ],
        applications: [
          { value: "High Traffic Commercial Flooring, Patios & Facades", chipLabel: "Flooring & Facades", label: "High Traffic Commercial Flooring, Patios & Facades" },
          { value: "Heritage Restoration, Temples & Classical Monuments", chipLabel: "Heritage Monuments", label: "Heritage Restoration, Temples & Classical Monuments" }
        ],
        moqs: [
          { value: "500 sq.ft (Quarry Lot)", chipLabel: "500 sq.ft", label: "500 sq.ft (Quarry Lot)" },
          { value: "1 Container / 20 Tonnes", chipLabel: "20T Container", label: "1 Container / 20 Tonnes (Export Grade)" }
        ],
        priceRanges: [
          { value: `${sym}110 – ${sym}180 / sq.ft`, chipLabel: `${sym}110-180`, label: `${sym}110 – ${sym}180 / sq.ft (Sawn Cladding)` },
          { value: `${sym}140 – ${sym}240 / sq.ft`, chipLabel: `${sym}140-240`, label: `${sym}140 – ${sym}240 / sq.ft (Calibrated Landscape)` }
        ]
      }
    };
  }

  if (family === "garlic") {
    return {
      version: 1,
      family: "garlic",
      companyName: brandName,
      location: loc.locationDisplay,
      currency: loc.currencyCode,
      headings: [
        { id: "h1", text: `${brandName} Mandi Corridor Sun-Cured Garlic`, category: "Cover / Title" },
        { id: "h2", text: "Malwa High-Allicin Export Grade Bulbs", category: "Section Title" },
        { id: "h3", text: "Organically Cultivated Cured Desi Lahsun", category: "Product Hero" },
        { id: "h4", text: "Industrial Food Processing & Dehydration Lots", category: "Commercial" }
      ],
      taglines: [
        { id: "t1", text: brandTagline || "Farm-Fresh High-Allicin Cured Garlic Bulbs" },
        { id: "t2", text: "Sun-cured with double skin protection; zero sprout emergence" },
        { id: "t3", text: "Direct procurement from Mandi & farm collective" }
      ],
      paragraphs: [
        {
          id: "p1",
          title: "Malwa Soil Provenance & Bioactive Potency",
          category: "Harvest Story",
          text: `Grown in the mineral-rich black cotton soils of ${loc.locationDisplay}, ${brandName}'s Malwa Garlic delivers high allicin concentration, intense pungency, and robust natural shelf stability.`
        },
        {
          id: "p2",
          title: "Controlled Shed Curing & Export Packaging",
          category: "Quality Standards",
          text: "Naturally shed-cured under ambient airflow to stabilize moisture under 65%, with intact double outer skins protecting against fungal emergence during multi-week containerized transit."
        }
      ],
      featureHighlights: [
        { id: "f1", text: "High natural allicin content delivering strong medicinal potency and pungency" },
        { id: "f2", text: "100% naturally shed sun-cured with double skin protection against moisture rot" },
        { id: "f3", text: "Zero chemical bleaching; free from sprout emergence, dirt, and damaged bulbs" },
        { id: "f4", text: "Packed in ventilated UV-stabilized mesh bags for long transit storage" },
        { id: "f5", text: "Strict grading with caliber sorting from 30mm to 65mm diameter" }
      ],
      specifications: {
        thicknesses: [
          {
            value: "50 - 65 mm (Grade A+ Large)",
            chipLabel: "50-65mm Grade A+",
            label: `50 - 65 mm (Grade A+ Large Bulbs) — ${sym}220 / kg`,
            price: 220,
            mrp: 280,
            priceRange: `${sym}200 – ${sym}260 / kg`
          },
          {
            value: "40 - 50 mm (Grade A Medium)",
            chipLabel: "40-50mm Grade A",
            label: `40 - 50 mm (Grade A Medium Mandi) — ${sym}180 / kg`,
            price: 180,
            mrp: 240,
            priceRange: `${sym}160 – ${sym}210 / kg`
          },
          {
            value: "30 - 40 mm (Grade B Commercial)",
            chipLabel: "30-40mm Commercial",
            label: `30 - 40 mm (Grade B Commercial Lot) — ${sym}140 / kg`,
            price: 140,
            mrp: 190,
            priceRange: `${sym}120 – ${sym}160 / kg`
          },
          {
            value: "G2 / Yamuna Safed Special Big Clove",
            chipLabel: "G2 Special Clove",
            label: `G2 / Yamuna Safed Special Big Clove — ${sym}260 / kg`,
            price: 260,
            mrp: 340,
            priceRange: `${sym}240 – ${sym}310 / kg`
          }
        ],
        sizes: [
          { value: "50 - 65 mm (Grade A+ Large)", chipLabel: "50-65mm A+", label: "50 - 65 mm (Grade A+ Large)" },
          { value: "40 - 50 mm (Grade A Medium)", chipLabel: "40-50mm A", label: "40 - 50 mm (Grade A Medium)" },
          { value: "30 - 40 mm (Grade B Commercial)", chipLabel: "30-40mm B", label: "30 - 40 mm (Grade B Commercial)" },
          { value: "G2 Yamuna Safed Premium Lot", chipLabel: "G2 Premium", label: "G2 Yamuna Safed Premium Lot" }
        ],
        finishes: [
          { value: "Sun-Cured Export Clean White Skin, Clean Cut Roots", chipLabel: "Sun-Cured White", label: "Sun-Cured Export Clean White Skin, Clean Cut Roots" },
          { value: "Natural Desi Pinkish-White Skin, 10-14 Cloves", chipLabel: "Desi Pinkish", label: "Natural Desi Pinkish-White Skin, 10-14 Cloves" },
          { value: "Unbleached Double-Skin Protected Bulbs", chipLabel: "Unbleached Double", label: "Unbleached Double-Skin Protected Bulbs" }
        ],
        materials: [
          { value: "100% Organically Grown Malwa Garlic (Moisture < 65%)", chipLabel: "Organic Malwa", label: "100% Organically Grown Malwa Garlic (Moisture < 65%)" },
          { value: "Yamuna Safed G2 Certified Bioactive Cultivar", chipLabel: "G2 Cultivar", label: "Yamuna Safed G2 Certified Bioactive Cultivar" }
        ],
        applications: [
          { value: "Malwa Desi Garlic in 25kg Aerated Red Mesh Bags", chipLabel: "25kg Mesh Bags", label: "Malwa Desi Garlic in 25kg Aerated Red Mesh Bags" },
          { value: "Amleta Big Clove in 10kg Corrugated Boxes", chipLabel: "10kg Cartons", label: "Amleta Big Clove in 10kg Corrugated Boxes" },
          { value: "Mandi Wholesale, Food Processing & Dehydration", chipLabel: "Food Processing", label: "Mandi Wholesale, Food Processing & Dehydration" }
        ],
        moqs: [
          { value: "500 kg (Wholesale Mandi Lot)", chipLabel: "500 kg", label: "500 kg (Wholesale Mandi Lot)" },
          { value: "5 Quintals (Wholesale Pack)", chipLabel: "5 Quintals", label: "5 Quintals (500 kg Trade Lot)" },
          { value: "1 Metric Tonne (Export Container)", chipLabel: "1 MT", label: "1 Metric Tonne (Containerized)" }
        ],
        priceRanges: [
          { value: `${sym}180 – ${sym}240 / kg`, chipLabel: `${sym}180-240`, label: `${sym}180 – ${sym}240 / kg (Grade A Cured)` },
          { value: `${sym}140 – ${sym}220 / kg`, chipLabel: `${sym}140-220`, label: `${sym}140 – ${sym}220 / kg (Wholesale Lot)` }
        ]
      }
    };
  }

  if (family === "kotadoria") {
    return {
      version: 1,
      family: "kotadoria",
      companyName: brandName,
      location: loc.locationDisplay,
      currency: loc.currencyCode,
      headings: [
        { id: "h1", text: `${brandName} Master Weaver Handloom Heritage`, category: "Cover / Title" },
        { id: "h2", text: "GI Certified Royal Gossamer Kota Doria Drapes", category: "Section Title" },
        { id: "h3", text: "Tested Gold Zari Khat Grid Silk-Cotton Sarees", category: "Product Hero" },
        { id: "h4", text: "Timeless Handloom Artisanship of Hadoti", category: "Artisan Pride" }
      ],
      taglines: [
        { id: "t1", text: brandTagline || "GI Certified Gossamer Handloom Drapes" },
        { id: "t2", text: "Authentic 300+ Square Khat Grid woven on traditional pit looms" },
        { id: "t3", text: "Direct weaver master-craft drapes with GI Tag No. 37 certification" }
      ],
      paragraphs: [
        {
          id: "p1",
          title: "Artisanal Pit-Loom Weaving Tradition",
          category: "Heritage",
          text: `Crafted by master weavers associated with ${brandName}, authentic Kota Doria is spun with pure mulberry silk warp for sheen and combed Egyptian cotton weft for strength.`
        },
        {
          id: "p2",
          title: "The Signature Khat Grid & Tested Zari",
          category: "Craftsmanship",
          text: "Characterized by its unique checked 'khat' pattern, our handwoven drapes are embellished with tested gold and silver zari pallus, creating an ethereal, featherlight feel for royal celebrations."
        }
      ],
      featureHighlights: [
        { id: "f1", text: "Certified authentic Geographical Indication (GI Tag No. 37) pit-loom craftsmanship" },
        { id: "f2", text: "Unique square khat grid structure creating a signature airy, gossamer drape" },
        { id: "f3", text: "Real tested electro-gold & silver zari woven into borders and ornate pallus" },
        { id: "f4", text: "Breathable lightweight comfort suitable for royal occasions and all seasons" }
      ],
      specifications: {
        thicknesses: [
          {
            value: "6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in",
            chipLabel: "6.5m Saree + Blouse",
            label: `6.5 Metres (Saree with Blouse Piece) — ${sym}3,500`,
            price: 3500,
            mrp: 5200,
            priceRange: `${sym}2,800 – ${sym}6,500`
          },
          {
            value: "5.5 Metres (Single Saree without Blouse) × 44 in",
            chipLabel: "5.5m Single Saree",
            label: `5.5 Metres (Single Saree) — ${sym}2,800`,
            price: 2800,
            mrp: 4200,
            priceRange: `${sym}2,400 – ${sym}4,800`
          },
          {
            value: "2.5 Metres (Handloom Dupatta) × 36 in",
            chipLabel: "2.5m Dupatta",
            label: `2.5 Metres (Handloom Dupatta) — ${sym}1,450`,
            price: 1450,
            mrp: 2200,
            priceRange: `${sym}1,200 – ${sym}2,400`
          },
          {
            value: "3-Piece Salwar Suit Cut (7.5m Total)",
            chipLabel: "3-Pc Suit Cut",
            label: `3-Piece Salwar Suit Ensemble (7.5m) — ${sym}4,200`,
            price: 4200,
            mrp: 6000,
            priceRange: `${sym}3,500 – ${sym}7,500`
          }
        ],
        sizes: [
          { value: "6.5 Metres (5.5m Saree + 0.8m Blouse) × 44 in", chipLabel: "6.5m Saree + Blouse", label: "6.5 Metres with 80cm Running Blouse" },
          { value: "5.5 Metres (Single Saree) × 44 in", chipLabel: "5.5m Saree", label: "5.5 Metres Single Saree" },
          { value: "2.5 Metres Dupatta × 36 in", chipLabel: "2.5m Dupatta", label: "2.5 Metres Handloom Dupatta" },
          { value: "Running Fabric by the Metre (44 in width)", chipLabel: "Running Yardage", label: "Running Fabric by the Metre" }
        ],
        finishes: [
          { value: "Traditional 300+ Square Khat Grid with Tested Gold Zari", chipLabel: "Gold Zari Khat", label: "Traditional 300+ Square Khat Grid with Tested Gold Zari" },
          { value: "Silver Zari Khat Check with Woven Floral Pallu", chipLabel: "Silver Zari", label: "Silver Zari Khat Check with Woven Floral Pallu" },
          { value: "Pure Cotton Plain Khat Grid with Contrast Resham Border", chipLabel: "Resham Border", label: "Pure Cotton Plain Khat Grid with Contrast Resham Border" },
          { value: "Bagru Hand-Block Floral Motifs in Natural Dyes", chipLabel: "Bagru Block", label: "Bagru Hand-Block Floral Motifs in Natural Dyes" }
        ],
        materials: [
          { value: "Pure Mulberry Silk & Cotton / Wedding & Festive Wear", chipLabel: "Bridal & Festive", label: "Pure Mulberry Silk & Cotton / Wedding & Festive Wear" },
          { value: "100% Pure Organic Cotton / Daily & Office Wear", chipLabel: "Daily Wear", label: "100% Pure Organic Cotton / Daily & Office Wear" },
          { value: "Tissue Silk Blend / High-End Boutique Luxury", chipLabel: "Boutique Luxury", label: "Tissue Silk Blend / High-End Boutique Luxury" }
        ],
        applications: [
          { value: "Royal Weddings, Receptions & Festive Ceremonies", chipLabel: "Weddings & Festive", label: "Royal Weddings, Receptions & Festive Ceremonies" },
          { value: "Designer Boutique High-Fashion Collections", chipLabel: "Boutique Fashion", label: "Designer Boutique High-Fashion Collections" },
          { value: "Aristocratic Summer Heritage Draping", chipLabel: "Summer Draping", label: "Aristocratic Summer Heritage Draping" }
        ],
        moqs: [
          { value: "10 Pieces (Wholesale Boutique Lot)", chipLabel: "10 Pieces", label: "10 Pieces (Wholesale Boutique Lot)" },
          { value: "25 Pieces (Assorted Colors Lot)", chipLabel: "25 Pieces", label: "25 Pieces (Assorted Colors Lot)" },
          { value: "50 Metres (Running Yardage)", chipLabel: "50 Metres", label: "50 Metres (Running Fabric Yardage)" }
        ],
        priceRanges: [
          { value: `${sym}2,800 – ${sym}6,500`, chipLabel: `${sym}2,800-6.5k`, label: `${sym}2,800 – ${sym}6,500 (Master Weaver Pure Silk-Cotton)` },
          { value: `${sym}1,400 – ${sym}2,800`, chipLabel: `${sym}1,400-2.8k`, label: `${sym}1,400 – ${sym}2,800 (Pure Cotton Doria Everyday)` },
          { value: `${sym}6,500 – ${sym}15,000`, chipLabel: `${sym}6,500-15k`, label: `${sym}6,500 – ${sym}15,000 (Royal Gold Zari Bridal)` }
        ]
      }
    };
  }

  // DEFAULT / GENERAL ENTERPRISE
  return {
    version: 1,
    family: "general",
    companyName: brandName,
    location: loc.locationDisplay,
    currency: loc.currencyCode,
    headings: [
      { id: "h1", text: `${brandName} Premium Enterprise Collection`, category: "Cover / Title" },
      { id: "h2", text: "Engineered Precision & Performance Range", category: "Section Title" },
      { id: "h3", text: "Flagship Signature Industrial Innovations", category: "Product Hero" },
      { id: "h4", text: "Sustainable Manufacturing & Quality Benchmark", category: "Heritage" }
    ],
    taglines: [
      { id: "t1", text: brandTagline || "Precision Engineering & Contemporary Design" },
      { id: "t2", text: "Built to stringent international quality and performance standards" },
      { id: "t3", text: "Direct manufacturer supply with full batch compliance warranty" }
    ],
    paragraphs: [
      {
        id: "p1",
        title: "Company Heritage & Vision",
        category: "Brand Story",
        text: `Based in ${loc.locationDisplay}, ${brandName} specializes in manufacturing precision solutions engineered for rigorous commercial durability and modern aesthetics.`
      },
      {
        id: "p2",
        title: "Quality Assurance & Standards",
        category: "Quality Standards",
        text: "Every item undergoes rigorous multi-point quality control testing to guarantee exceptional reliability, regulatory compliance, and maximum operational efficiency."
      }
    ],
    featureHighlights: [
      { id: "f1", text: "Precision engineered components conforming to international safety standards" },
      { id: "f2", text: "High durability commercial construction rated for extensive duty cycles" },
      { id: "f3", text: "Ergonomic, modern industrial design optimized for practical deployment" },
      { id: "f4", text: "Full batch traceability with manufacturer backed commercial warranty" }
    ],
    specifications: {
      thicknesses: [
        {
          value: "Standard Pro Series (Base Model)",
          chipLabel: "Pro Series",
          label: `Standard Pro Series (Base Model) — ${sym}1,250`,
          price: 1250,
          mrp: 1750,
          priceRange: `${sym}1,100 – ${sym}1,500`
        },
        {
          value: "Enterprise Ultra Edition (High Spec)",
          chipLabel: "Enterprise Ultra",
          label: `Enterprise Ultra Edition (High Spec) — ${sym}2,450`,
          price: 2450,
          mrp: 3200,
          priceRange: `${sym}2,200 – ${sym}2,900`
        },
        {
          value: "Compact Studio Edition",
          chipLabel: "Compact",
          label: `Compact Studio Edition — ${sym}850`,
          price: 850,
          mrp: 1200,
          priceRange: `${sym}750 – ${sym}990`
        }
      ],
      sizes: [
        { value: "Standard Commercial Format", chipLabel: "Standard Format", label: "Standard Commercial Format" },
        { value: "Extended Capacity Large Unit", chipLabel: "Extended Unit", label: "Extended Capacity Large Unit" },
        { value: "Compact Desktop / Field Unit", chipLabel: "Compact Unit", label: "Compact Desktop / Field Unit" }
      ],
      finishes: [
        { value: "Matte Anodized Precision Finish", chipLabel: "Matte Anodized", label: "Matte Anodized Precision Finish" },
        { value: "Textured Powder-Coated Industrial Satin", chipLabel: "Textured Satin", label: "Textured Powder-Coated Industrial Satin" },
        { value: "Brushed Architectural Metallic Surface", chipLabel: "Brushed Metallic", label: "Brushed Architectural Metallic Surface" }
      ],
      materials: [
        { value: "Aerospace-Grade Alloy & Reinforced Composite", chipLabel: "Reinforced Alloy", label: "Aerospace-Grade Alloy & Reinforced Composite" },
        { value: "High-Density Thermal-Resistant Polymer", chipLabel: "Thermal Polymer", label: "High-Density Thermal-Resistant Polymer" },
        { value: "Certified Bio-Neutral Recycled Composite", chipLabel: "Bio Composite", label: "Certified Bio-Neutral Recycled Composite" }
      ],
      applications: [
        { value: "Commercial, Industrial & Professional Deployment", chipLabel: "Commercial Deploy", label: "Commercial, Industrial & Professional Deployment" },
        { value: "Institutional & Enterprise High-Reliability Operations", chipLabel: "Enterprise Ops", label: "Institutional & Enterprise High-Reliability Operations" }
      ],
      moqs: [
        { value: "10 Units (Standard Trade Minimum)", chipLabel: "10 Units", label: "10 Units (Standard Trade Minimum)" },
        { value: "50 Units (Wholesale Commercial Batch)", chipLabel: "50 Units", label: "50 Units (Wholesale Commercial Batch)" },
        { value: "250 Units (Master Distributor Container)", chipLabel: "250 Units", label: "250 Units (Master Distributor Container)" }
      ],
      priceRanges: [
        { value: `${sym}850 – ${sym}1,500`, chipLabel: `${sym}850-1.5k`, label: `${sym}850 – ${sym}1,500 (Standard)` },
        { value: `${sym}2,200 – ${sym}3,800`, chipLabel: `${sym}2.2k-3.8k`, label: `${sym}2,200 – ${sym}3,800 (Enterprise)` }
      ]
    }
  };
}

module.exports = {
  resolveCompanyCategory,
  resolveCompanyLocation,
  getDefaultDataBank,
};
