const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, default: '' },
  label: { type: String, required: true },
  page: { type: String, required: true, enum: ['home', 'about', 'contact'] },
  section: { type: String, required: true },
  type: { type: String, enum: ['text', 'textarea', 'image'], default: 'text' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

siteContentSchema.statics.getPage = async function(page) {
  const items = await this.find({ page }).sort('section order');
  const content = {};
  items.forEach(item => {
    content[item.key] = item.value;
  });
  return content;
};

siteContentSchema.statics.getAll = async function() {
  const items = await this.find().sort('page section order');
  const pages = {};
  items.forEach(item => {
    if (!pages[item.page]) pages[item.page] = {};
    pages[item.page][item.key] = item.value;
  });
  return pages;
};

module.exports = mongoose.model('SiteContent', siteContentSchema);
