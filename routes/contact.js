const router = require('express').Router();
const Contact = require('../models/Contact');
const SiteContent = require('../models/SiteContent');

router.get('/', async (req, res) => {
  try {
    const c = await SiteContent.getPage('contact');
    res.render('contact', {
      title: 'Contact Oceanis Hotel Douala | Reservations & Inquiries',
      metaDesc: 'Contact Oceanis Hotel in Douala, Cameroon. Email oceaniscm@gmail.com or visit us in Bonanjo District. Available 24/7 for reservations and inquiries.',
      c
    });
  } catch (err) {
    console.error(err);
    res.render('contact', { title: 'Contact Oceanis Hotel Douala', c: {} });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await Contact.create({ name, email, phone, subject, message });
    req.session.flash = { type: 'success', message: 'Message sent! We will get back to you soon.' };
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Failed to send message. Please try again.' };
    res.redirect('/contact');
  }
});

module.exports = router;
