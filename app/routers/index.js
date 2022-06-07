const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
const smokedController = require('../controllers/smoked');

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

module.exports = router;
