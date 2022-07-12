const { Message } = require('../models');

module.exports = {
  createMessage: async (req, res) => {
    try {
      const { message, chat_id, user_id } = req.body;

      if (!message || !chat_id || !user_id) {
        return res.status(400).json({
          data: [],
          error: 'Vous devez saisir un message, un sujet de chat et un utilisateur',
        });
      }

      const new_message = new Message({
        message,
        chat_id,
        user_id,
      });

      await new_message.save();

      return res.status(200).json({
        isCreatedMessageSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
