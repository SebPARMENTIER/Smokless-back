// Environment variables
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const express = require('express');

const app = express();
const cors = require('cors');
const router = require('./app/routers');

// Allow access to DB
app.use(cors());

// Body parser
app.use(express.json());

// Routing
app.use(router);

// Server laucnh
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
