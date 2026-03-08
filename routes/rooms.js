const router = require('express').Router();
const Room = require('../models/Room');

router.get('/', async (req, res) => {
  try {
    const { type, sort, search } = req.query;
    let filter = { available: true };

    if (type && type !== 'all') {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const rooms = await Room.find(filter).sort(sortOption);
    const types = ['Standard', 'Deluxe', 'Suite', 'Presidential'];

    res.render('rooms', {
      title: 'Rooms & Suites - Oceanis Hotel Douala | Book from 22,000 CFA',
      metaDesc: 'Browse luxury rooms and suites at Oceanis Hotel in Douala, Cameroon. Standard, Deluxe, Suite & Presidential options. Book online with best rate guarantee.',
      rooms,
      types,
      currentType: type || 'all',
      currentSort: sort || 'newest',
      search: search || ''
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug });
    if (!room) {
      req.session.flash = { type: 'error', message: 'Room not found.' };
      return res.redirect('/rooms');
    }
    const relatedRooms = await Room.find({
      _id: { $ne: room._id },
      type: room.type,
      available: true
    }).limit(3);
    res.render('room-detail', {
      title: `${room.name} - ${room.type} Room | Oceanis Hotel Douala`,
      metaDesc: `Book the ${room.name} at Oceanis Hotel. ${room.shortDescription || room.description.substring(0, 150)} From ${room.price.toLocaleString()} CFA/night.`,
      room,
      relatedRooms
    });
  } catch (err) {
    console.error(err);
    res.redirect('/rooms');
  }
});

module.exports = router;
