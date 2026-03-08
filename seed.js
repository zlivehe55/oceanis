require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
const Gallery = require('./models/Gallery');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Gallery.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Oceanis Admin',
      email: 'admin@oceanis-cm.com',
      password: 'admin123',
      role: 'admin',
      phone: '+237 600 000 000'
    });
    console.log('Admin created: admin@oceanis-cm.com / admin123');

    // Create sample rooms
    const rooms = await Room.create([
      {
        name: 'Standard Comfort Room',
        type: 'Standard',
        description: 'A welcoming retreat designed for comfort and relaxation. Our Standard Comfort Room features a plush queen-size bed, modern en-suite bathroom with premium toiletries, and a work desk perfect for business travelers. Enjoy complimentary high-speed WiFi, air conditioning, and a flat-screen TV with international channels.\n\nThe room is tastefully decorated with warm African-inspired accents that create a serene atmosphere after a long day exploring Douala.',
        shortDescription: 'Cozy and modern room with queen bed, perfect for solo travelers or couples.',
        price: 25000,
        capacity: 2,
        size: 25,
        bedType: 'Queen Bed',
        amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Fridge', 'Safe', 'Desk'],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d955f4f2b?w=800&q=80'
        ],
        featured: true,
        rating: 4.3,
        reviewCount: 47
      },
      {
        name: 'Deluxe Ocean View',
        type: 'Deluxe',
        description: 'Elevate your stay with our Deluxe Ocean View room, offering breathtaking panoramic views of the Atlantic. This spacious room features a luxurious king-size bed with premium linens, a sitting area with comfortable armchairs, and a marble bathroom with rainfall shower and deep soaking tub.\n\nStep out onto your private balcony to enjoy the ocean breeze and stunning sunset views over Douala\'s coastline. The room includes a fully stocked minibar, Nespresso machine, and 55-inch smart TV.',
        shortDescription: 'Spacious room with king bed and stunning ocean views from your private balcony.',
        price: 45000,
        capacity: 2,
        size: 38,
        bedType: 'King Bed',
        amenities: ['WiFi', 'Ocean View', 'Balcony', 'Air Conditioning', 'TV', 'Mini Bar', 'Bathtub', 'Coffee Machine', 'Room Service', 'Safe'],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80'
        ],
        featured: true,
        rating: 4.7,
        reviewCount: 89
      },
      {
        name: 'Family Deluxe Suite',
        type: 'Deluxe',
        description: 'Designed with families in mind, our Family Deluxe Suite offers generous space and thoughtful amenities for travelers with children. The suite features a master bedroom with king bed, a separate sleeping area with two twin beds, and a comfortable living space.\n\nThe large bathroom includes both a shower and bathtub, perfect for little ones. Enjoy family movie nights on the 60-inch TV or relax on the furnished balcony while the kids play in the living area.',
        shortDescription: 'Perfect for families with separate sleeping areas and a spacious living room.',
        price: 55000,
        capacity: 4,
        size: 52,
        bedType: 'King + 2 Twin',
        amenities: ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar', 'Bathtub', 'Living Area', 'Balcony', 'Safe', 'Room Service'],
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
        ],
        featured: true,
        rating: 4.6,
        reviewCount: 62
      },
      {
        name: 'Executive Suite',
        type: 'Suite',
        description: 'Our Executive Suite is the perfect blend of business and luxury. Featuring a separate living room with elegant furnishings, a spacious bedroom with premium king bed, and a stunning marble bathroom, this suite is designed for the discerning traveler.\n\nThe dedicated workspace includes ergonomic seating and high-speed WiFi, while the living area offers a comfortable setting for informal meetings or evening relaxation. Complimentary access to the Executive Lounge is included.',
        shortDescription: 'Elegant suite with separate living room, ideal for business travelers.',
        price: 75000,
        capacity: 2,
        size: 65,
        bedType: 'King Bed',
        amenities: ['WiFi', 'Ocean View', 'Living Room', 'Balcony', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Bathtub', 'Coffee Machine', 'Safe', 'Iron', 'Lounge Access'],
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80'
        ],
        featured: true,
        rating: 4.8,
        reviewCount: 34
      },
      {
        name: 'Presidential Suite',
        type: 'Presidential',
        description: 'The crown jewel of Oceanis, our Presidential Suite spans an impressive 120 square meters of unmatched luxury. This extraordinary suite features a grand master bedroom, a spacious living and dining area with premium furnishings, a fully equipped kitchenette, and two opulent marble bathrooms.\n\nFloor-to-ceiling windows frame spectacular views of the Atlantic Ocean, while the wraparound terrace offers the perfect setting for private dining under the stars. Enjoy 24-hour butler service, complimentary airport transfers, and exclusive access to all hotel facilities.',
        shortDescription: 'The ultimate luxury experience with panoramic ocean views and personal butler service.',
        price: 150000,
        capacity: 4,
        size: 120,
        bedType: 'Super King Bed',
        amenities: ['WiFi', 'Panoramic Ocean View', 'Terrace', 'Living Room', 'Dining Area', 'Kitchenette', 'Air Conditioning', '65" Smart TV', 'Premium Mini Bar', 'Jacuzzi', 'Butler Service', 'Airport Transfer', 'Lounge Access', 'Spa Access'],
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80'
        ],
        featured: true,
        rating: 4.9,
        reviewCount: 18
      },
      {
        name: 'Standard Twin Room',
        type: 'Standard',
        description: 'Perfect for friends or colleagues traveling together, our Standard Twin Room features two comfortable single beds, a modern bathroom, and all the essentials for a pleasant stay. The room is equipped with WiFi, air conditioning, and a flat-screen TV.\n\nCompact yet thoughtfully designed, this room maximizes comfort without compromising on quality.',
        shortDescription: 'Comfortable twin room ideal for friends or colleagues traveling together.',
        price: 22000,
        capacity: 2,
        size: 22,
        bedType: '2 Single Beds',
        amenities: ['WiFi', 'Air Conditioning', 'TV', 'Safe', 'Desk'],
        images: [
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80'
        ],
        featured: false,
        rating: 4.1,
        reviewCount: 31
      }
    ]);
    console.log(`${rooms.length} rooms created`);

    // Create gallery images
    const gallery = await Gallery.create([
      { image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', title: 'Hotel Exterior', category: 'exterior', order: 1 },
      { image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', title: 'Ocean View Room', category: 'rooms', order: 2 },
      { image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80', title: 'Swimming Pool', category: 'pool', order: 3 },
      { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', title: 'Restaurant', category: 'restaurant', order: 4 },
      { image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&q=80', title: 'Spa & Wellness', category: 'spa', order: 5 },
      { image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', title: 'Hotel Lobby', category: 'exterior', order: 6 },
      { image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80', title: 'Premium Suite', category: 'rooms', order: 7 },
      { image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80', title: 'Events Hall', category: 'events', order: 8 }
    ]);
    console.log(`${gallery.length} gallery images created`);

    console.log('\nSeed completed successfully!');
    console.log('---');
    console.log('Admin Login: admin@oceanis-cm.com / admin123');
    console.log('---');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
