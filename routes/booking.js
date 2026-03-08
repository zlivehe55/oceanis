const router = require('express').Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');

router.post('/', async (req, res) => {
  try {
    const { roomId, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, specialRequests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      req.session.flash = { type: 'error', message: 'Room not found.' };
      return res.redirect('/rooms');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < 1) {
      req.session.flash = { type: 'error', message: 'Check-out must be after check-in.' };
      return res.redirect(`/rooms/${room.slug}`);
    }

    const totalPrice = room.price * nights;

    const booking = await Booking.create({
      room: room._id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: parseInt(guests) || 1,
      totalPrice,
      specialRequests,
      user: req.session.userId || undefined
    });

    req.session.flash = { type: 'success', message: 'Booking submitted successfully!' };
    res.redirect(`/booking/${booking._id}/confirmation`);
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Booking failed. Please try again.' };
    res.redirect('/rooms');
  }
});

router.get('/:id/confirmation', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('room');
    if (!booking) {
      req.session.flash = { type: 'error', message: 'Booking not found.' };
      return res.redirect('/');
    }
    res.render('booking-confirmation', {
      title: 'Booking Confirmed - Oceanis Hotel Douala',
      metaDesc: 'Your reservation at Oceanis Hotel is confirmed. View your booking details and prepare for a luxurious stay in Douala, Cameroon.',
      booking
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
