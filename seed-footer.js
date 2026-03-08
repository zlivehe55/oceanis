require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');

const items = [
  { key: 'footer_tagline', value: 'Experience unparalleled luxury in the heart of Douala. Where the ocean meets refined elegance.', label: 'Footer Tagline', page: 'footer', section: 'Branding', type: 'textarea', order: 1 },

  { key: 'footer_social_twitter', value: '#', label: 'Twitter / X URL', page: 'footer', section: 'Social Media', type: 'text', order: 1 },
  { key: 'footer_social_instagram', value: '#', label: 'Instagram URL', page: 'footer', section: 'Social Media', type: 'text', order: 2 },
  { key: 'footer_social_facebook', value: '#', label: 'Facebook URL', page: 'footer', section: 'Social Media', type: 'text', order: 3 },

  { key: 'footer_address', value: 'Douala, Cameroon\nBonanjo District', label: 'Address', page: 'footer', section: 'Contact Info', type: 'textarea', order: 1 },
  { key: 'footer_email', value: 'oceaniscm@gmail.com', label: 'Email', page: 'footer', section: 'Contact Info', type: 'text', order: 2 },
  { key: 'footer_phone', value: '+237 6XX XXX XXX', label: 'Phone Number', page: 'footer', section: 'Contact Info', type: 'text', order: 3 },

  { key: 'footer_copyright', value: 'Oceanis Hotel. All rights reserved.', label: 'Copyright Text', page: 'footer', section: 'Bottom Bar', type: 'text', order: 1 },
  { key: 'footer_privacy_url', value: '#', label: 'Privacy Policy URL', page: 'footer', section: 'Bottom Bar', type: 'text', order: 2 },
  { key: 'footer_terms_url', value: '#', label: 'Terms of Service URL', page: 'footer', section: 'Bottom Bar', type: 'text', order: 3 },
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const item of items) {
    await SiteContent.findOneAndUpdate({ key: item.key }, item, { upsert: true, new: true });
  }
  console.log(`${items.length} footer content items seeded`);
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
