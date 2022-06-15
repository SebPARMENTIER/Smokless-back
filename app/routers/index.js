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

router.route('/user')
  .get(userController.getAll)
  .post(userController.signup);

router.route('/login')
  .post(userController.login);

router.route('/smoked')
  .get(smokedController.getAll);

router.use('*', authenticateToken);

router.route('/user/:id(\\d+)')
  .get(userController.getById)
  .delete(userController.deleteAccount);

router.route('/user/pseudo')
  .patch(userController.updatePseudo);

router.route('/user/password')
  .patch(userController.updatePassword);

router.route('/user/average')
  .patch(userController.updateAverage);

router.route('/smoked/:id(\\d+)')
  .get(smokedController.getById);

router.route('/smoked')
  .post(smokedController.addConsumption)
  .patch(smokedController.updateConsumption);

module.exports = router;
