const { Op, Sequelize } = require('sequelize');
const {
  General_chat,
  General_message,
  User,
} = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { general_chat_id } = req.body;

      const chat = await General_message.findAll({
        attributes: ['id',
          [Sequelize.col('general_chat.subject'), 'subject'],
          'message',
        ],
        where: {
          general_chat_id,
        },
        include: [
          {
            model: General_chat,
            association: 'general_chat',
            attributes: ['id', 'subject'],
            // order: ['id'],
          },
          {
            model: User,
            association: 'user_general_message',
            attributes: ['pseudo'],
          },
        ],
      });

      if (!chat) {
        return res.status(404).json({
          error: 'Chat non trouvé',
        });
      }

      return res.status(200).json(chat);
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

      const subjectIsTaken = await General_chat.findOne({
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

      const general_chat = new General_chat({ subject });

      general_chat.save();

      return res.status(200).json({
        isCreatedGeneralChatSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
