const mongoose = require('mongoose');
const slugify = require('slugify');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential'],
    required: true
  },
  description: { type: String, required: true },
  shortDescription: { type: String },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 2 },
  size: { type: Number },
  bedType: { type: String },
  amenities: [String],
  images: [String],
  featured: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

roomSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);
