const router = require('express').Router();
const User = require('../models/User');
const { isGuest, isLoggedIn } = require('../middleware/auth');

router.get('/login', isGuest, (req, res) => {
  res.render('login', { title: 'Login - Oceanis' });
});

router.post('/login', isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      req.session.flash = { type: 'error', message: 'Invalid email or password.' };
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;
    req.session.flash = { type: 'success', message: `Welcome back, ${user.name}!` };

    if (user.role === 'admin') {
      return res.redirect('/admin');
    }
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Login failed. Please try again.' };
    res.redirect('/auth/login');
  }
});

router.get('/register', isGuest, (req, res) => {
  res.render('register', { title: 'Register - Oceanis' });
});

router.post('/register', isGuest, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (password !== confirmPassword) {
      req.session.flash = { type: 'error', message: 'Passwords do not match.' };
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.session.flash = { type: 'error', message: 'Password must be at least 6 characters.' };
      return res.redirect('/auth/register');
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.session.flash = { type: 'error', message: 'Email already registered.' };
      return res.redirect('/auth/register');
    }

    const user = await User.create({ name, email, password, phone });
    req.session.userId = user._id;
    req.session.flash = { type: 'success', message: 'Account created successfully!' };
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'error', message: 'Registration failed. Please try again.' };
    res.redirect('/auth/register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
