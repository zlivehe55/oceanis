require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'oceanis-fallback-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 7 * 24 * 60 * 60
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(async (req, res, next) => {
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  if (req.session.userId) {
    try {
      const User = require('./models/User');
      res.locals.user = await User.findById(req.session.userId);
    } catch (e) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }

  res.locals.currentPath = req.path;
  res.locals.siteName = process.env.SITE_NAME || 'Oceanis';

  if (!req.path.startsWith('/admin')) {
    try {
      const SiteContent = require('./models/SiteContent');
      res.locals.footer = await SiteContent.getPage('footer');
    } catch (e) {
      res.locals.footer = {};
    }
  }

  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/', require('./routes/index'));
app.use('/rooms', require('./routes/rooms'));
app.use('/booking', require('./routes/booking'));
app.use('/contact', require('./routes/contact'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Oceanis running on http://localhost:${PORT}`);
});
