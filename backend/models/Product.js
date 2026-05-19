const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  weight: { type: String, enum: ['250g', '500g', '1kg', 'unit'], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nameTelugu: { type: String, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  category: {
    type: String,
    enum: ['pickle', 'powder', 'spice', 'dryfruit', 'ghee', 'tea', 'sweet', 'other'],
    required: true,
  },
  description: { type: String },
  prices: [priceSchema],
  images: [{ type: String }],
  isWithoutGarlic: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
