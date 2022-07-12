// Environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');

const app = express();
const cors = require('cors');
const sanitizer = require('sanitizer');
const session = require('express-session');
const router = require('./app/routers');

// Allow access to DB
app.use(cors());

// Body parser
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) {
    for (const prop in req.body) {
      req.body[prop] = sanitizer.escape(req.body[prop]);
    }
  }
  next();
});

// Session
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: process.env.SESSION_SECRET,
}));

// Routing
app.use(router);

// Server laucnh
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
