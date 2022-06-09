const { Op } = require('sequelize');

/* eslint-disable camelcase */
const { Smoked } = require('../models');

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

      const consumptionExists = await Smoked.findOne({
        where: {
          [Op.and]: [
            { user_id },
            { day_id },
          ],
        },
      });

      if (consumptionExists) {
        return res.status(400).json({
          data: [],
          error: 'Données déjà entrées pour ce jour et cet utilisateur. Si vous souhaitez modifier le nombre de cigarettes consummées, servez vous de la fonction modifier',
        });
      }

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
