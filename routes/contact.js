const router = require('express').Router();
const Contact = require('../models/Contact');

router.get('/', (req, res) => {
  res.render('contact', { title: 'Contact Us - Oceanis' });
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
