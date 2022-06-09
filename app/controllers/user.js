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
          error: 'Mot de passe trop court : min 8 caractères',
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
        user,
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
        user,
        message: 'Pseudo mis à jour',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        data: [],
        error: 'Désolé, une erreur est survenue, veuillez réessayer ultérieurement',
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
        user,
        message: 'Mot de passe mis à jour',
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: 'Désolé, une erreur est survenue, veuillez réessayer ultérieurement',
      });
    }
  },
};
