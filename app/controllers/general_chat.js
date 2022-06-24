const {
  General_chat,
  General_message,
  User,
} = require('../models');

module.exports = {
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const chat = await General_chat.findByPk(id, {
        attributes: ['id', 'subject'],
        include: {
          model: General_message,
          association: 'general_chat',
          attributes: ['id', 'message'],
          order: ['id'],
          include: {
            model: User,
            association: 'user_generel_message',
            attributes: ['pseudo'],
          },
        },
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
