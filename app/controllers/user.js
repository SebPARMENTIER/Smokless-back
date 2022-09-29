const { Op, Sequelize } = require('sequelize');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  User,
  Consumption,
  Day,
  Month,
  Year,
} = require('../models');

const generatedAccessToken = () => jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

module.exports = {
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: ['id', 'pseudo', 'email', 'average', 'price'],
      });

      if (!user) {
        return res.status(404).json({
          error: 'Utilisateur non trouvé',
        });
      }

      const allConsumptionPerMonth = await Month.findAll({
        raw: true,
        attributes: ['month',
          [Sequelize.col('year.year'), 'year'],
          [Sequelize.fn('SUM', Sequelize.col('days.consumption_days.quantity')), 'total'],
        ],
        include: [
          {
            model: Year,
            association: 'year',
            attributes: [],
          },
          {
            model: Day,
            association: 'days',
            attributes: [],
            include: [
              {
                model: Consumption,
                association: 'consumption_days',
                attributes: [],
                where: {
                  user_id: id,
                },
              },
            ],
          },
        ],
        group: ['Month.id', 'year.year'],
        order: ['id'],
      });

      const allConsumptionPerYear = await Year.findAll({
        raw: true,
        attributes: ['year',
          [Sequelize.fn('SUM', Sequelize.col('monthes.days.consumption_days.quantity')), 'total'],
        ],
        include: [
          {
            model: Month,
            association: 'monthes',
            attributes: [],
            include: [
              {
                model: Day,
                association: 'days',
                attributes: [],
                include: [
                  {
                    model: Consumption,
                    association: 'consumption_days',
                    attributes: [],
                    where: {
                      user_id: id,
                    },
                  },
                ],
              },
            ],
          },
        ],
        group: ['Year.id'],
        order: ['id'],
      });

      const monthlyConsumption = allConsumptionPerMonth.filter((c) => c.total != null);
      const annualConsumption = allConsumptionPerYear.filter((c) => c.total != null);
      return res.status(200).json({
        user,
        monthlyConsumption,
        annualConsumption,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },
  getAll: async (_, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'pseudo', 'email', 'average', 'price'],
      });
      return res.status(200).json(users);
    } catch (error) {
      res.status(400).json({
        data: [],
        error: error.message,
      });
    }
  },
  signup: async (req, res) => {
    try {
      const {
        pseudo,
        email,
        password,
        average,
        price,
      } = req.body;

      const pseudoIsTaken = await User.findOne({
        where: {
          pseudo: {
            [Op.iLike]: pseudo,
          },
        },
      });

      if (pseudoIsTaken) {
        return res.status(400).json({
          data: [],
          error: 'Le pseudo est déjà utilisé',
        });
      }

      const emailIsTaken = await User.findOne({
        where: {
          email: {
            [Op.iLike]: email,
          },
        },
      });

      if (emailIsTaken) {
        return res.status(400).json({
          data: [],
          error: "L'email est déjà utilisé",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          data: [],
          error: 'Mot de passe trop court : min 8 caractères',
        });
      }

      if (!emailValidator.validate(req.body.email)) {
        return res.status(400).json({
          data: [],
          error: 'Email non valide',
        });
      }

      const user = new User({
        pseudo,
        email,
        password: bcrypt.hashSync(password, 7),
        average,
        price,
      });

      await user.save();

      return res.status(200).json({
        isCreatedUserSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: 'Désolé, une erreur est survenue, veuillez réessayer ultérieurement',
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          data: [],
          error: 'Vous devez entrer un email et un mot de passe',
        });
      }

      const user = await User.findOne({
        where: {
          email: {
            [Op.iLike]: email,
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          data: [],
          error: "L'email renseigné n'existe pas",
        });
      }

      const passwordIsMatch = await bcrypt.compare(password, user.password);

      if (!passwordIsMatch) {
        return res.status(400).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      const allUserData = user.toJSON();
      // Keep user datas without password
      const userData = { ...(delete allUserData.password && allUserData) };

      const accessToken = generatedAccessToken();

      // Put user into session without password
      delete user.dataValues.password;
      delete user._previousDataValues.password;
      req.session.user = user;

      return res.status(200).json({
        isLoggedUserSuccess: true,
        userData,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        data: [],
        error: error.message,
      });
    }
  },
  updatePseudo: async (req, res) => {
    try {
      const { id, password, pseudo } = req.body;

      if (!password || !pseudo) {
        return res.status(400).json({
          data: [],
          error: 'Pseudo ou mot de passe manquant',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          data: [],
          error: 'Utilisateur non trouvé',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      await user.update({
        pseudo,
      });

      return res.status(200).json({
        isPseudoUpdatedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { id, password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res.status(400).json({
          data: [],
          error: 'Ancien mot de passe ou nouveau mot de passe manquant',
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          data: [],
          error: 'Mot de passe trop court : min 8 caractères',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          data: [],
          error: 'Utilisateur non trouvé',
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isMatch) {
        return res.status(403).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      await user.update({
        password: bcrypt.hashSync(newPassword, 7),
      });

      return res.status(200).json({
        isPasswordUpdatedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: 'Désolé, une erreur est survenue, veuillez réessayer ultérieurement',
      });
    }
  },
  updateAverage: async (req, res) => {
    try {
      const { id, password, average } = req.body;

      if (!password || !average) {
        return res.status(400).json({
          data: [],
          error: 'Moyenne ou mot de passe manquant',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          data: [],
          error: 'Utilisateur non trouvé',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      await user.update({
        average,
      });

      return res.status(200).json({
        isAverageUpdatedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  updatePrice: async (req, res) => {
    try {
      const { id, password, price } = req.body;

      if (!password || !price) {
        return res.status(400).json({
          data: [],
          error: 'Prix ou mot de passe manquant',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          data: [],
          error: 'Utilisateur non trouvé',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      await user.update({
        price,
      });

      return res.status(200).json({
        isPriceUpdatedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          data: [],
          error: 'Mot de passe manquant',
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          data: [],
          error: 'Utilisateur non trouvé',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(403).json({
          data: [],
          error: 'Le mot de passe ne correspond pas',
        });
      }

      await user.destroy();

      return res.status(200).json({
        isUserAccountDeletedSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
