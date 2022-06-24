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
};
