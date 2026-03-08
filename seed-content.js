require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');

const contentItems = [
  // ========== HOME PAGE ==========
  // Hero
  { key: 'home_hero_welcome', value: 'Welcome to Oceanis', label: 'Welcome Text', page: 'home', section: 'Hero', type: 'text', order: 1 },
  { key: 'home_hero_title1', value: 'Luxury on the', label: 'Title Line 1', page: 'home', section: 'Hero', type: 'text', order: 2 },
  { key: 'home_hero_title2', value: 'Coast of Douala', label: 'Title Line 2 (Gold)', page: 'home', section: 'Hero', type: 'text', order: 3 },
  { key: 'home_hero_subtitle', value: 'Experience world-class hospitality where the Atlantic meets refined elegance. Your unforgettable stay begins here.', label: 'Subtitle', page: 'home', section: 'Hero', type: 'textarea', order: 4 },
  { key: 'home_hero_image', value: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80', label: 'Background Image URL', page: 'home', section: 'Hero', type: 'image', order: 5 },

  // About Section
  { key: 'home_about_label', value: 'About Oceanis', label: 'Section Label', page: 'home', section: 'About Section', type: 'text', order: 1 },
  { key: 'home_about_title', value: 'A Haven of Refined Luxury', label: 'Title', page: 'home', section: 'About Section', type: 'text', order: 2 },
  { key: 'home_about_text1', value: 'Nestled in the vibrant heart of Douala, Oceanis Hotel offers an extraordinary blend of Cameroonian warmth and world-class sophistication. Every detail has been thoughtfully curated to ensure your comfort and delight.', label: 'Paragraph 1', page: 'home', section: 'About Section', type: 'textarea', order: 3 },
  { key: 'home_about_text2', value: 'From our elegantly appointed rooms with ocean-inspired design to our exceptional dining and spa experiences, we invite you to discover a new standard of hospitality on the West African coast.', label: 'Paragraph 2', page: 'home', section: 'About Section', type: 'textarea', order: 4 },
  { key: 'home_about_image', value: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', label: 'Section Image URL', page: 'home', section: 'About Section', type: 'image', order: 5 },
  { key: 'home_about_stat_number', value: '15+', label: 'Stat Number', page: 'home', section: 'About Section', type: 'text', order: 6 },
  { key: 'home_about_stat_label', value: 'Years of Excellence', label: 'Stat Label', page: 'home', section: 'About Section', type: 'text', order: 7 },

  // Rooms Section
  { key: 'home_rooms_label', value: 'Accommodation', label: 'Section Label', page: 'home', section: 'Rooms Section', type: 'text', order: 1 },
  { key: 'home_rooms_title', value: 'Our Finest Rooms', label: 'Title', page: 'home', section: 'Rooms Section', type: 'text', order: 2 },
  { key: 'home_rooms_subtitle', value: 'Each room is a sanctuary of comfort, blending contemporary design with warm African touches.', label: 'Subtitle', page: 'home', section: 'Rooms Section', type: 'textarea', order: 3 },

  // Amenities
  { key: 'home_amenities_label', value: 'Services', label: 'Section Label', page: 'home', section: 'Amenities', type: 'text', order: 1 },
  { key: 'home_amenities_title', value: 'Hotel Amenities', label: 'Title', page: 'home', section: 'Amenities', type: 'text', order: 2 },

  // Gallery
  { key: 'home_gallery_label', value: 'Gallery', label: 'Section Label', page: 'home', section: 'Gallery', type: 'text', order: 1 },
  { key: 'home_gallery_title', value: 'Moments at Oceanis', label: 'Title', page: 'home', section: 'Gallery', type: 'text', order: 2 },

  // CTA
  { key: 'home_cta_label', value: 'Ready for Luxury?', label: 'Section Label', page: 'home', section: 'Call to Action', type: 'text', order: 1 },
  { key: 'home_cta_title', value: 'Book Your Stay Today', label: 'Title', page: 'home', section: 'Call to Action', type: 'text', order: 2 },
  { key: 'home_cta_text', value: 'Indulge in an experience that transcends the ordinary. Reserve your room at Oceanis and create memories that last a lifetime.', label: 'Description', page: 'home', section: 'Call to Action', type: 'textarea', order: 3 },
  { key: 'home_cta_image', value: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80', label: 'Background Image URL', page: 'home', section: 'Call to Action', type: 'image', order: 4 },

  // Testimonials
  { key: 'home_testimonials_label', value: 'Testimonials', label: 'Section Label', page: 'home', section: 'Testimonials', type: 'text', order: 1 },
  { key: 'home_testimonials_title', value: 'Guest Reviews', label: 'Title', page: 'home', section: 'Testimonials', type: 'text', order: 2 },
  { key: 'home_review1_name', value: 'Marie T.', label: 'Review 1 - Name', page: 'home', section: 'Testimonials', type: 'text', order: 3 },
  { key: 'home_review1_location', value: 'Paris, France', label: 'Review 1 - Location', page: 'home', section: 'Testimonials', type: 'text', order: 4 },
  { key: 'home_review1_text', value: 'An absolutely stunning hotel. The rooms are impeccable, the staff is incredibly warm, and the location is perfect. My best stay in Douala by far.', label: 'Review 1 - Text', page: 'home', section: 'Testimonials', type: 'textarea', order: 5 },
  { key: 'home_review2_name', value: 'Jean-Pierre K.', label: 'Review 2 - Name', page: 'home', section: 'Testimonials', type: 'text', order: 6 },
  { key: 'home_review2_location', value: 'Douala, Cameroon', label: 'Review 2 - Location', page: 'home', section: 'Testimonials', type: 'text', order: 7 },
  { key: 'home_review2_text', value: 'Oceanis sets the standard for luxury hospitality in Cameroon. The attention to detail and service quality are truly world-class.', label: 'Review 2 - Text', page: 'home', section: 'Testimonials', type: 'textarea', order: 8 },
  { key: 'home_review3_name', value: 'Sarah M.', label: 'Review 3 - Name', page: 'home', section: 'Testimonials', type: 'text', order: 9 },
  { key: 'home_review3_location', value: 'London, UK', label: 'Review 3 - Location', page: 'home', section: 'Testimonials', type: 'text', order: 10 },
  { key: 'home_review3_text', value: 'From the moment we arrived, everything was perfect. Beautiful rooms, amazing restaurant, and the pool area is a dream. Highly recommend!', label: 'Review 3 - Text', page: 'home', section: 'Testimonials', type: 'textarea', order: 11 },

  // ========== ABOUT PAGE ==========
  // Hero
  { key: 'about_hero_label', value: 'Our Story', label: 'Section Label', page: 'about', section: 'Hero', type: 'text', order: 1 },
  { key: 'about_hero_title', value: 'About Oceanis', label: 'Title', page: 'about', section: 'Hero', type: 'text', order: 2 },
  { key: 'about_hero_subtitle', value: 'Where Cameroonian warmth meets world-class luxury on the Atlantic coast.', label: 'Subtitle', page: 'about', section: 'Hero', type: 'textarea', order: 3 },
  { key: 'about_hero_image', value: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80', label: 'Background Image URL', page: 'about', section: 'Hero', type: 'image', order: 4 },

  // Story
  { key: 'about_story_label', value: 'Est. 2010', label: 'Section Label', page: 'about', section: 'Our Story', type: 'text', order: 1 },
  { key: 'about_story_title', value: 'Crafted for Those Who Appreciate the Finer Things', label: 'Title', page: 'about', section: 'Our Story', type: 'text', order: 2 },
  { key: 'about_story_text1', value: 'Oceanis Hotel was born from a vision to bring world-class hospitality to the vibrant city of Douala. Situated in the prestigious Bonanjo district, our hotel combines the rich cultural heritage of Cameroon with contemporary luxury.', label: 'Paragraph 1', page: 'about', section: 'Our Story', type: 'textarea', order: 3 },
  { key: 'about_story_text2', value: 'Every corner of Oceanis tells a story - from the locally sourced artwork adorning our walls to the flavors of our restaurant that celebrate the diversity of Cameroonian cuisine. Our dedicated team is committed to making every stay an unforgettable experience.', label: 'Paragraph 2', page: 'about', section: 'Our Story', type: 'textarea', order: 4 },
  { key: 'about_story_text3', value: "Whether you're visiting for business, leisure, or a special occasion, Oceanis is more than a hotel - it's a destination that captures the spirit of Douala and the warmth of its people.", label: 'Paragraph 3', page: 'about', section: 'Our Story', type: 'textarea', order: 5 },
  { key: 'about_story_image', value: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', label: 'Story Image URL', page: 'about', section: 'Our Story', type: 'image', order: 6 },

  // Stats
  { key: 'about_stat1_number', value: '15+', label: 'Stat 1 Number', page: 'about', section: 'Stats', type: 'text', order: 1 },
  { key: 'about_stat1_label', value: 'Years of Service', label: 'Stat 1 Label', page: 'about', section: 'Stats', type: 'text', order: 2 },
  { key: 'about_stat2_number', value: '50+', label: 'Stat 2 Number', page: 'about', section: 'Stats', type: 'text', order: 3 },
  { key: 'about_stat2_label', value: 'Luxury Rooms', label: 'Stat 2 Label', page: 'about', section: 'Stats', type: 'text', order: 4 },
  { key: 'about_stat3_number', value: '10K+', label: 'Stat 3 Number', page: 'about', section: 'Stats', type: 'text', order: 5 },
  { key: 'about_stat3_label', value: 'Happy Guests', label: 'Stat 3 Label', page: 'about', section: 'Stats', type: 'text', order: 6 },
  { key: 'about_stat4_number', value: '4.8', label: 'Stat 4 Number', page: 'about', section: 'Stats', type: 'text', order: 7 },
  { key: 'about_stat4_label', value: 'Average Rating', label: 'Stat 4 Label', page: 'about', section: 'Stats', type: 'text', order: 8 },

  // Values
  { key: 'about_values_label', value: 'Our Values', label: 'Section Label', page: 'about', section: 'Values', type: 'text', order: 1 },
  { key: 'about_values_title', value: 'What Sets Us Apart', label: 'Title', page: 'about', section: 'Values', type: 'text', order: 2 },
  { key: 'about_value1_title', value: 'Exceptional Service', label: 'Value 1 Title', page: 'about', section: 'Values', type: 'text', order: 3 },
  { key: 'about_value1_text', value: 'Our staff is trained to anticipate your needs before you even ask. From the moment you arrive, every interaction is personalized.', label: 'Value 1 Description', page: 'about', section: 'Values', type: 'textarea', order: 4 },
  { key: 'about_value2_title', value: 'Luxury & Comfort', label: 'Value 2 Title', page: 'about', section: 'Values', type: 'text', order: 5 },
  { key: 'about_value2_text', value: 'Premium linens, state-of-the-art amenities, and meticulously designed spaces ensure your comfort at every turn.', label: 'Value 2 Description', page: 'about', section: 'Values', type: 'textarea', order: 6 },
  { key: 'about_value3_title', value: 'Local Heritage', label: 'Value 3 Title', page: 'about', section: 'Values', type: 'text', order: 7 },
  { key: 'about_value3_text', value: 'We celebrate the rich culture of Cameroon through our cuisine, design, and the genuine warmth of our hospitality.', label: 'Value 3 Description', page: 'about', section: 'Values', type: 'textarea', order: 8 },

  // CTA
  { key: 'about_cta_title', value: 'Experience Oceanis', label: 'CTA Title', page: 'about', section: 'Call to Action', type: 'text', order: 1 },
  { key: 'about_cta_text', value: 'Ready to discover the finest hotel in Douala? Book your stay today and let us create unforgettable memories for you.', label: 'CTA Description', page: 'about', section: 'Call to Action', type: 'textarea', order: 2 },

  // ========== CONTACT PAGE ==========
  // Hero
  { key: 'contact_hero_label', value: 'Get in Touch', label: 'Section Label', page: 'contact', section: 'Hero', type: 'text', order: 1 },
  { key: 'contact_hero_title', value: 'Contact Us', label: 'Title', page: 'contact', section: 'Hero', type: 'text', order: 2 },
  { key: 'contact_hero_subtitle', value: "We'd love to hear from you. Reach out for reservations, inquiries, or any assistance.", label: 'Subtitle', page: 'contact', section: 'Hero', type: 'textarea', order: 3 },

  // Contact Details
  { key: 'contact_address', value: 'Bonanjo District\nDouala, Cameroon', label: 'Address', page: 'contact', section: 'Contact Details', type: 'textarea', order: 1 },
  { key: 'contact_phone', value: '+237 6XX XXX XXX', label: 'Phone Number', page: 'contact', section: 'Contact Details', type: 'text', order: 2 },
  { key: 'contact_phone_hours', value: 'Mon - Sun, 24/7', label: 'Phone Hours', page: 'contact', section: 'Contact Details', type: 'text', order: 3 },
  { key: 'contact_email', value: 'oceaniscm@gmail.com', label: 'Email Address', page: 'contact', section: 'Contact Details', type: 'text', order: 4 },
  { key: 'contact_website', value: 'oceanis-cm.com', label: 'Website', page: 'contact', section: 'Contact Details', type: 'text', order: 5 },
  { key: 'contact_map_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63698.98830796741!2d9.6756!3d4.0483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061128be2e1fe6d%3A0x8bf3c0e9517e91!2sDouala%2C%20Cameroon!5e0!3m2!1sen!2s!4v1', label: 'Google Maps Embed URL', page: 'contact', section: 'Contact Details', type: 'textarea', order: 6 },
];

async function seedContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const item of contentItems) {
      await SiteContent.findOneAndUpdate(
        { key: item.key },
        item,
        { upsert: true, new: true }
      );
    }

    console.log(`${contentItems.length} content items seeded (upsert - existing values preserved)`);
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedContent();
