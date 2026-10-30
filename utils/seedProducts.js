/**
 * Run with:  npm run seed          -> inserts sample products
 *            npm run seed:destroy  -> deletes all products
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const products = [
  // ---------------- Electronics ----------------
  { name: "iPhone 15", description: "Apple iPhone 15 with A16 Bionic chip, 6.1-inch Super Retina XDR display and 48MP main camera.", price: 69999, category: "Electronics", brand: "Apple", image: "https://images.unsplash.com/photo-1592286927505-1def25115481?w=600", rating: 4.6, stock: 45 },
  { name: "Samsung Galaxy S24", description: "Samsung Galaxy S24 with Snapdragon 8 Gen 3, AMOLED display and AI-powered camera features.", price: 64999, category: "Electronics", brand: "Samsung", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600", rating: 4.5, stock: 38 },
  { name: "OnePlus 12", description: "OnePlus 12 flagship smartphone with Hasselblad camera system and 100W SuperVOOC fast charging.", price: 52999, category: "Electronics", brand: "OnePlus", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600", rating: 4.4, stock: 30 },
  { name: "MacBook Air M2", description: "Apple MacBook Air with M2 chip, 13.6-inch Liquid Retina display, up to 18 hours of battery life.", price: 114900, category: "Electronics", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", rating: 4.8, stock: 20 },
  { name: "Dell XPS 13", description: "Dell XPS 13 ultrabook with Intel Core i7, InfinityEdge display and a compact aluminum chassis.", price: 99990, category: "Electronics", brand: "Dell", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600", rating: 4.3, stock: 15 },
  { name: "Sony WH-1000XM5", description: "Sony WH-1000XM5 wireless noise-cancelling headphones with industry-leading ANC and 30-hour battery.", price: 29990, category: "Electronics", brand: "Sony", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600", rating: 4.7, stock: 60 },
  { name: "boAt Airdopes 141", description: "boAt Airdopes 141 true wireless earbuds with 42 hours playback and ENx tech for calls.", price: 1299, category: "Electronics", brand: "boAt", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", rating: 4.1, stock: 150 },
  { name: "Apple Watch Series 9", description: "Apple Watch Series 9 with S9 chip, always-on Retina display and advanced health sensors.", price: 41900, category: "Electronics", brand: "Apple", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", rating: 4.6, stock: 35 },
  { name: "Canon EOS R10", description: "Canon EOS R10 mirrorless camera with 24.2MP APS-C sensor and 4K video recording.", price: 84999, category: "Electronics", brand: "Canon", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", rating: 4.5, stock: 12 },
  { name: "LG 55-inch 4K OLED TV", description: "LG OLED55C3 55-inch 4K Smart TV with self-lit pixels, Dolby Vision and webOS.", price: 129990, category: "Electronics", brand: "LG", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600", rating: 4.7, stock: 8 },
  { name: "Logitech MX Master 3S", description: "Logitech MX Master 3S wireless mouse with 8K DPI sensor and quiet clicks.", price: 8995, category: "Electronics", brand: "Logitech", image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600", rating: 4.8, stock: 70 },
  { name: "JBL Flip 6", description: "JBL Flip 6 portable Bluetooth speaker with punchy sound and IP67 waterproof rating.", price: 9999, category: "Electronics", brand: "JBL", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", rating: 4.4, stock: 55 },

  // ---------------- Fashion ----------------
  { name: "Levi's 511 Slim Jeans", description: "Levi's 511 slim fit men's jeans made from stretch denim for all-day comfort.", price: 2999, category: "Fashion", brand: "Levi's", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", rating: 4.3, stock: 90 },
  { name: "Nike Air Force 1", description: "Nike Air Force 1 '07 classic leather sneakers with iconic silhouette and Air cushioning.", price: 8495, category: "Fashion", brand: "Nike", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600", rating: 4.7, stock: 65 },
  { name: "Adidas Originals Hoodie", description: "Adidas Originals Trefoil hoodie made from soft cotton fleece for everyday wear.", price: 3799, category: "Fashion", brand: "Adidas", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", rating: 4.2, stock: 80 },
  { name: "Ray-Ban Aviator Sunglasses", description: "Ray-Ban Aviator Classic sunglasses with gold metal frame and green G-15 lenses.", price: 8990, category: "Fashion", brand: "Ray-Ban", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", rating: 4.6, stock: 40 },
  { name: "Fossil Gen 6 Smartwatch Strap Watch", description: "Fossil men's chronograph watch with leather strap and stainless steel case.", price: 9995, category: "Fashion", brand: "Fossil", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600", rating: 4.4, stock: 28 },
  { name: "H&M Cotton T-Shirt Pack", description: "H&M pack of 3 regular fit cotton crew-neck t-shirts in essential colors.", price: 1499, category: "Fashion", brand: "H&M", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", rating: 4.0, stock: 120 },
  { name: "Puma Running Shorts", description: "Puma dryCELL men's running shorts with moisture-wicking fabric and side pockets.", price: 1799, category: "Fashion", brand: "Puma", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600", rating: 4.1, stock: 75 },
  { name: "Zara Wool Blend Coat", description: "Zara women's wool blend long coat with a tailored fit and notched lapel.", price: 6990, category: "Fashion", brand: "Zara", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600", rating: 4.5, stock: 22 },
  { name: "Woodland Leather Boots", description: "Woodland genuine leather outdoor boots with anti-skid sole for rugged terrain.", price: 4495, category: "Fashion", brand: "Woodland", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600", rating: 4.3, stock: 50 },

  // ---------------- Home ----------------
  { name: "Prestige Induction Cooktop", description: "Prestige PIC 3.1 V3 1900-watt induction cooktop with 8 preset cooking functions.", price: 3299, category: "Home", brand: "Prestige", image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600", rating: 4.2, stock: 40 },
  { name: "Philips Air Fryer HD9252", description: "Philips Digital Air Fryer with Rapid Air technology for healthier fried food with less oil.", price: 8995, category: "Home", brand: "Philips", image: "https://images.unsplash.com/photo-1585237017125-24baf8d7406f?w=600", rating: 4.6, stock: 33 },
  { name: "IKEA MALM Bed Frame", description: "IKEA MALM queen-size bed frame in oak veneer with clean, minimalist Scandinavian design.", price: 17990, category: "Home", brand: "IKEA", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", rating: 4.4, stock: 10 },
  { name: "Milton Thermosteel Flask", description: "Milton Thermosteel 1-litre vacuum insulated flask that keeps beverages hot or cold for hours.", price: 899, category: "Home", brand: "Milton", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600", rating: 4.3, stock: 200 },
  { name: "Havells Ceiling Fan", description: "Havells Stealth Air 1200mm ceiling fan with high air delivery and anti-dust coating.", price: 3499, category: "Home", brand: "Havells", image: "https://images.unsplash.com/photo-1631048283454-c98c37e5c2c3?w=600", rating: 4.1, stock: 48 },
  { name: "Wonderchef Nutri-blend", description: "Wonderchef Nutri-blend mixer grinder with 400-watt motor and 3 unbreakable jars.", price: 2599, category: "Home", brand: "Wonderchef", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600", rating: 4.0, stock: 60 },
  { name: "Bombay Dyeing Bedsheet Set", description: "Bombay Dyeing 144 TC cotton double bedsheet set with 2 pillow covers, floral print.", price: 1199, category: "Home", brand: "Bombay Dyeing", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600", rating: 4.2, stock: 85 },

  // ---------------- Sports ----------------
  { name: "Yonex Nanoflare Badminton Racket", description: "Yonex Nanoflare 001 badminton racket built for speed and quick attacking play.", price: 2999, category: "Sports", brand: "Yonex", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600", rating: 4.5, stock: 45 },
  { name: "SG Cricket Bat", description: "SG Sunny Tonny English willow cricket bat suited for intermediate to advanced players.", price: 4999, category: "Sports", brand: "SG", image: "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=600", rating: 4.4, stock: 25 },
  { name: "Decathlon Yoga Mat", description: "Decathlon Kimjaly 8mm comfort yoga mat with non-slip surface for home workouts.", price: 999, category: "Sports", brand: "Decathlon", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600", rating: 4.3, stock: 130 },
  { name: "Nivia Football", description: "Nivia Storm size 5 football designed for training and recreational matches.", price: 799, category: "Sports", brand: "Nivia", image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600", rating: 4.1, stock: 100 },
  { name: "Cosco Dumbbell Set", description: "Cosco rubber-coated dumbbell set (2x5kg) ideal for home strength training.", price: 1899, category: "Sports", brand: "Cosco", image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600", rating: 4.2, stock: 55 },

  // ---------------- Books ----------------
  { name: "Atomic Habits", description: "James Clear's bestselling guide to building good habits and breaking bad ones.", price: 499, category: "Books", brand: "Penguin", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600", rating: 4.8, stock: 200 },
  { name: "The Alchemist", description: "Paulo Coelho's timeless novel about a shepherd's journey to find his personal legend.", price: 350, category: "Books", brand: "HarperCollins", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600", rating: 4.7, stock: 180 },
  { name: "Clean Code", description: "Robert C. Martin's classic guide to writing readable, maintainable software.", price: 899, category: "Books", brand: "Pearson", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600", rating: 4.6, stock: 70 },
  { name: "Sapiens", description: "Yuval Noah Harari's exploration of how Homo sapiens came to dominate the world.", price: 599, category: "Books", brand: "Vintage", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600", rating: 4.7, stock: 90 },
  { name: "Rich Dad Poor Dad", description: "Robert Kiyosaki's personal finance classic on building wealth and financial literacy.", price: 399, category: "Books", brand: "Plata Publishing", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600", rating: 4.5, stock: 150 },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    const created = await Product.insertMany(products);
    console.log(`✅ Seeded ${created.length} products successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log("🗑️  All products deleted");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error deleting data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
