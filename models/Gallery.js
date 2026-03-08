const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, trim: true },
  category: {
    type: String,
    enum: ['rooms', 'restaurant', 'pool', 'exterior', 'events', 'spa'],
    default: 'rooms'
  },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
