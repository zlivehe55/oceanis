const router = require('express').Router();
const Room = require('../models/Room');
const Gallery = require('../models/Gallery');

router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ featured: true, available: true }).limit(6);
    const gallery = await Gallery.find({ active: true }).sort('order').limit(8);
    res.render('index', { title: 'Oceanis - Luxury Hotel in Douala', rooms, gallery });
  } catch (err) {
    console.error(err);
    res.render('index', { title: 'Oceanis - Luxury Hotel in Douala', rooms: [], gallery: [] });
  }
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us - Oceanis' });
});

module.exports = router;
