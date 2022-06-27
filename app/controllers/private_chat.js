const { Op, Sequelize } = require('sequelize');
const {
  Private_chat,
  Private_message,
  User,
} = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { private_chat_id } = req.body;

      const subject = await Private_chat.findByPk(private_chat_id, {
        attributes: ['subject'],
      });

      const chat = await Private_message.findAll({
        attributes: ['id',
          [Sequelize.col('user_general_message.pseudo'), 'pseudo'],
          'message'],
        where: {
          private_chat_id,
        },
        order: ['id'],
        raw: true,
        include: [
          {
            model: User,
            association: 'user_general_message',
            attributes: [],
          },
        ],
      });

      if (!chat) {
        return res.status(404).json({
          error: 'Chat non trouvé',
        });
      }

      return res.status(200).json({
        subject,
        chat,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
  createChat: async (req, res) => {
    try {
      const { subject } = req.body;

      if (!subject) {
        return res.status(400).json({
          error: 'Vous devez saisir un sujet',
        });
      }

      const subjectIsTaken = await Private_chat.findOne({
        where: {
          subject: {
            [Op.like]: subject,
          },
        },
      });

      if (subjectIsTaken) {
        return res.status(400).json({
          error: 'Le sujet existe déjà',
        });
      }

      const private_chat = new Private_chat({ subject });

      private_chat.save();

      return res.status(200).json({
        isCreatedPrivateChatSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
