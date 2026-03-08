const router = require('express').Router();
const { isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');
const User = require('../models/User');
const SiteContent = require('../models/SiteContent');
const fs = require('fs');
const path = require('path');

router.use(isAdmin);

router.get('/', async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const unreadContacts = await Contact.countDocuments({ read: false });
    const recentBookings = await Booking.find()
      .populate('room')
      .sort({ createdAt: -1 })
      .limit(10);
    const totalUsers = await User.countDocuments();

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Oceanis',
      stats: {
        totalRooms,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
        unreadContacts,
        totalUsers
      },
      recentBookings,
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// --- Rooms ---
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.render('admin/rooms', { title: 'Manage Rooms - Oceanis', rooms, layout: false });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.get('/rooms/new', (req, res) => {
  res.render('admin/room-form', { title: 'Add Room - Oceanis', room: null, layout: false });
});

router.get('/rooms/:id/edit', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.redirect('/admin/rooms');
    res.render('admin/room-form', { title: 'Edit Room - Oceanis', room, layout: false });
  } catch (err) {
    res.redirect('/admin/rooms');
  }
});

router.post('/rooms', upload.array('images', 10), async (req, res) => {
  try {
    const { name, type, description, shortDescription, price, capacity, size, bedType, amenities, featured } = req.body;
    const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
    await Room.create({
      name,
      type,
      description,
      shortDescription,
      price: parseFloat(price),
      capacity: parseInt(capacity),
      size: size ? parseFloat(size) : undefined,
      bedType,
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      images,
      featured: featured === 'on'
    });
    req.session.flash = { type: 'success', message: 'Room created successfully!' };
    res.redirect('/admin/rooms');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Failed to create room.' };
    res.redirect('/admin/rooms/new');
  }
});

router.put('/rooms/:id', upload.array('images', 10), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.redirect('/admin/rooms');

    const { name, type, description, shortDescription, price, capacity, size, bedType, amenities, featured, removeImages } = req.body;

    room.name = name;
    room.type = type;
    room.description = description;
    room.shortDescription = shortDescription;
    room.price = parseFloat(price);
    room.capacity = parseInt(capacity);
    room.size = size ? parseFloat(size) : room.size;
    room.bedType = bedType;
    room.amenities = amenities ? amenities.split(',').map(a => a.trim()) : [];
    room.featured = featured === 'on';

    if (removeImages) {
      const toRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      toRemove.forEach(img => {
        const filePath = path.join(__dirname, '..', 'public', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      room.images = room.images.filter(img => !toRemove.includes(img));
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => '/uploads/' + f.filename);
      room.images = [...room.images, ...newImages];
    }

    await room.save();
    req.session.flash = { type: 'success', message: 'Room updated successfully!' };
    res.redirect('/admin/rooms');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Failed to update room.' };
    res.redirect(`/admin/rooms/${req.params.id}/edit`);
  }
});

router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.images.forEach(img => {
        const filePath = path.join(__dirname, '..', 'public', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      await room.deleteOne();
    }
    req.session.flash = { type: 'success', message: 'Room deleted.' };
    res.redirect('/admin/rooms');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/rooms');
  }
});

// --- Bookings ---
router.get('/bookings', async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    const bookings = await Booking.find(filter).populate('room').sort({ createdAt: -1 });
    res.render('admin/bookings', { title: 'Manage Bookings - Oceanis', bookings, currentStatus: status || 'all', layout: false });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) return res.redirect('/admin/bookings');
    res.render('admin/booking-detail', { title: 'Booking Details - Oceanis', booking, layout: false });
  } catch (err) {
    res.redirect('/admin/bookings');
  }
});

router.put('/bookings/:id', async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    await Booking.findByIdAndUpdate(req.params.id, { status, paymentStatus });
    req.session.flash = { type: 'success', message: 'Booking updated.' };
    res.redirect(`/admin/bookings/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect('/admin/bookings');
  }
});

// --- Gallery ---
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort('order');
    res.render('admin/gallery', { title: 'Manage Gallery - Oceanis', gallery, layout: false });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.post('/gallery', upload.single('image'), async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!req.file) {
      req.session.flash = { type: 'error', message: 'Please select an image.' };
      return res.redirect('/admin/gallery');
    }
    await Gallery.create({
      image: '/uploads/' + req.file.filename,
      title,
      category
    });
    req.session.flash = { type: 'success', message: 'Image uploaded!' };
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/gallery');
  }
});

router.delete('/gallery/:id', async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (item) {
      const filePath = path.join(__dirname, '..', 'public', item.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await item.deleteOne();
    }
    req.session.flash = { type: 'success', message: 'Image deleted.' };
    res.redirect('/admin/gallery');
  } catch (err) {
    res.redirect('/admin/gallery');
  }
});

// --- Contacts ---
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('admin/contacts', { title: 'Messages - Oceanis', contacts, layout: false });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.put('/contacts/:id/read', async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    req.session.flash = { type: 'success', message: 'Message deleted.' };
    res.redirect('/admin/contacts');
  } catch (err) {
    res.redirect('/admin/contacts');
  }
});

// --- Pages (CMS) ---
router.get('/pages', async (req, res) => {
  try {
    const pages = [
      { slug: 'home', name: 'Home Page', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { slug: 'about', name: 'About Page', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
      { slug: 'contact', name: 'Contact Page', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ];

    for (const page of pages) {
      page.fieldCount = await SiteContent.countDocuments({ page: page.slug });
    }

    res.render('admin/pages', { title: 'Edit Pages - Oceanis', pages, layout: false });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
});

router.get('/pages/:page', async (req, res) => {
  try {
    const pageName = req.params.page;
    if (!['home', 'about', 'contact'].includes(pageName)) {
      return res.redirect('/admin/pages');
    }

    const items = await SiteContent.find({ page: pageName }).sort('section order');

    const sections = {};
    items.forEach(item => {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });

    const pageLabels = { home: 'Home Page', about: 'About Page', contact: 'Contact Page' };

    res.render('admin/page-edit', {
      title: `Edit ${pageLabels[pageName]} - Oceanis`,
      pageName,
      pageLabel: pageLabels[pageName],
      sections,
      layout: false
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/pages');
  }
});

router.post('/pages/:page', async (req, res) => {
  try {
    const pageName = req.params.page;
    if (!['home', 'about', 'contact'].includes(pageName)) {
      return res.redirect('/admin/pages');
    }

    const updates = req.body;
    const keys = Object.keys(updates);

    for (const key of keys) {
      if (key.startsWith(pageName + '_')) {
        await SiteContent.findOneAndUpdate(
          { key },
          { value: updates[key] },
          { upsert: false }
        );
      }
    }

    req.session.flash = { type: 'success', message: 'Page content updated successfully!' };
    res.redirect(`/admin/pages/${pageName}`);
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Failed to update page content.' };
    res.redirect(`/admin/pages/${req.params.page}`);
  }
});

module.exports = router;
