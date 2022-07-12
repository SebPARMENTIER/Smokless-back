const { Op, Sequelize } = require('sequelize');
const {
  Chat,
  Message,
  User,
} = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { chat_id } = req.body;

      const subject = await Chat.findByPk(chat_id, {
        attributes: ['subject'],
      });

      const chat = await Message.findAll({
        attributes: ['id',
          [Sequelize.col('user_message.pseudo'), 'pseudo'],
          'message'],
        where: {
          chat_id,
        },
        order: ['id'],
        raw: true,
        include: [
          {
            model: User,
            association: 'user_message',
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

      const subjectIsTaken = await Chat.findOne({
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

      const chat = new Chat({ subject });

      chat.save();

      return res.status(200).json({
        isCreatedChatSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
