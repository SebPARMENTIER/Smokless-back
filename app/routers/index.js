const express = require("express");
const router = express.Router();

router.get('/', (_, res) => {
  res.json({
      message: "API Smok'Less",
      author: "PARMENTIER Sébastien"
  });
});

module.exports = router;