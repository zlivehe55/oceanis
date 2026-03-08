const User = require('../models/User');

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.session.flash = { type: 'error', message: 'Please log in to continue.' };
    return res.redirect('/auth/login');
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    req.session.flash = { type: 'error', message: 'Please log in to continue.' };
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      req.session.flash = { type: 'error', message: 'Access denied.' };
      return res.redirect('/');
    }
    next();
  } catch (err) {
    res.redirect('/');
  }
};

exports.isGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};
