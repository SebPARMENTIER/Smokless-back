/* eslint-disable camelcase */
const { User, Smoked, Day } = require('../models');

module.exports = {
  // eslint-disable-next-line consistent-return
  getAll: async (_, res) => {
    try {
      const smoked = await Smoked.findAll();
      return res.status(200).json(smoked);
    } catch (error) {
      res.status(400).json({
        data: [],
        error: error.message,
      });
    }
  },
  // eslint-disable-next-line consistent-return
  addConsumption: async (req, res) => {
    try {
      // eslint-disable-next-line camelcase
      const { quantity, user_id, day_id } = req.body;

      const smoked = new Smoked({
        quantity,
        // eslint-disable-next-line camelcase
        user_id,
        day_id,
      });

      await smoked.save();

      res.status(200).json(smoked);
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
