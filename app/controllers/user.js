const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  User,
  Smoked,
  Day,
  Month,
  Year,
} = require('../models');

const generatedAccessToken = () => jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

module.exports = {
  // eslint-disable-next-line consistent-return
  getAll: async (_, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Smoked,
            association: 'consumption',
            attributes: ['quantity'],
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
          error: 'Password trop court : min 8 caractères',
        });
      }

      const user = new User({
        pseudo,
        email,
        password: bcrypt.hashSync(password, 7),
        average,
      });

      await user.save();

      return res.status(200).json({
        data: user,
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

      const userData = user.toJSON();
      const accessToken = generatedAccessToken();

      return res.status(200).json({
        ...userData,
        accessToken,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        data: [],
        error: 'Désolé, une erreur est survenue, veuillez réessayer ultérieurement',
      });
    }
  },
};
