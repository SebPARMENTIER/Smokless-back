const { Op } = require('sequelize');

const {
  Consumption,
  Day,
  Month,
  Year,
  User,
} = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const consumption = await Consumption.findByPk(id, {
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
            attributes: ['id', 'pseudo', 'email', 'average', 'price'],
          },
        ],
      });

      if (!consumption) {
        return res.status(404).json({
          error: 'Consommation non trouvée',
        });
      }
      return res.status(200).json(consumption);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  getAllConsumptionByUser: async (req, res) => {
    try {
      const { id } = req.body;

      const user = await User.findByPk(id, {
        attributes: ['id', 'pseudo', 'email', 'average', 'price'],
        include: [
          {
            model: Consumption,
            association: 'consumption',
            attributes: ['id', 'quantity'],
            include: [
              {
                model: Day,
                association: 'day',
                attributes: ['day'],
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
            ],
          },
        ],
      });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  addConsumption: async (req, res) => {
    try {
      const { quantity, user_id, day_id } = req.body;

      const consumptionExists = await Consumption.findOne({
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

      const consumption = new Consumption({
        quantity,
        user_id,
        day_id,
      });

      await consumption.save();

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
  updateConsumption: async (req, res) => {
    try {
      const { id, quantity } = req.body;

      const consumption = await Consumption.findByPk(id);

      if (!consumption) {
        return res.status(404).json({
          error: 'Consommation non trouvée',
        });
      }

      await consumption.update({
        quantity,
      });

      return res.status(200).json({
        isConsumptionUpdatedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  deleteConsumption: async (req, res) => {
    try {
      const { id } = req.params;

      const consumption = await Consumption.findByPk(id);

      if (!consumption) {
        return res.status(404).json({
          error: 'Consommation non trouvée',
        });
      }

      await consumption.destroy();

      return res.status(200).json({
        isConsumptionDeletedSucces: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
