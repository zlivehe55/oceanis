const router = require('express').Router();
const Room = require('../models/Room');
const Gallery = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ featured: true, available: true }).limit(6);
    const gallery = await Gallery.find({ active: true }).sort('order').limit(8);
    res.render('index', {
      title: 'Oceanis Hotel - Luxury Accommodation in Douala, Cameroon',
      metaDesc: 'Book your stay at Oceanis Hotel in Douala, Cameroon. Luxury rooms, suites, pool, spa & restaurant. Best rates from 22,000 CFA/night on the Atlantic coast.',
      rooms,
      gallery
    });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Oceanis Hotel - Luxury Accommodation in Douala, Cameroon', rooms: [], gallery: [] });
  }
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Oceanis Hotel - Our Story | Douala, Cameroon',
    metaDesc: 'Learn about Oceanis Hotel, a premier luxury hotel in Douala, Cameroon. 15+ years of exceptional hospitality, elegant rooms, and world-class service on the Atlantic coast.'
  });
});

module.exports = router;
