/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');

const userController = require('../controllers/user');
const smokedController = require('../controllers/smoked');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
};

router.get('/', (_, res) => {
  res.json({
    message: "API Smok'Less",
    author: 'PARMENTIER Sébastien',
  });
});

router.get('/user', userController.getAll);

router.post('/user', userController.signup);

router.post('/login', userController.login);

router.get('/smoked', smokedController.getAll);

router.post('/smoked', smokedController.addConsumption);

router.use('*', authenticateToken);

router.route('/user/password/:id(\\d+)')
  .patch(userController.updatePassword);

module.exports = router;
