const { Op } = require('sequelize');

const { Smoked, Day, Month, Year, User } = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const smoked = await Smoked.findByPk(id, {
        attributes: ['id', 'quantity'],
        include: [
          {
            model: Day,
            association: 'day',
            attributes: ['id', 'day'],
            include: [
              {
                model: Month,
                association: 'month',
                attributes: ['month'],
                include: [
                  {
                    model: Year,
                    association: 'year',
                    attributes: ['year'],
                  },
                ],
              },
            ],
          },
          {
            model: User,
            association: 'user',
            attributes: ['id', 'pseudo', 'email', 'average'],
          },
        ],
      });

      if (!smoked) {
        return res.status(404).json({
          error: 'Consommation non trouvée',
        });
      }
      return res.status(200).json(smoked);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
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
  addConsumption: async (req, res) => {
    try {
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
        user_id,
        day_id,
      });

      await smoked.save();

      res.status(200).json({
        isConsumptionAddedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
