const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const CatalogueProduct = require('./models/CatalogueProduct');
  const prods = await CatalogueProduct.find({ sku: { $regex: 'GRL' } }).lean();
  console.log('Count:', prods.length);
  prods.forEach(p => console.log('SKU:', p.sku, 'NAME:', p.name, 'IMG:', p.image));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
