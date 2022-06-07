const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generatedAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });

module.exports = {
  // eslint-disable-next-line consistent-return
  getAll: async (_, res) => {
    try {
      const users = await User.findAll();
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
      const { pseudo, email, password } = req.body;

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
};
