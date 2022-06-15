// Environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');

const app = express();
const cors = require('cors');
const sanitizer = require('sanitizer');
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

// Routing
app.use(router);

// Server laucnh
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
