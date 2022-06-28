const { Private_message } = require('../models');

module.exports = {
  createMessage: async (req, res) => {
    try {
      const { message, private_chat_id, user_id } = req.body;

      if (!message || !private_chat_id || !user_id) {
        return res.status(400).json({
          data: [],
          error: 'Vous devez saisir un message, un sujet de chat et un utilisateur',
        });
      }

      const private_message = new Private_message({
        message,
        private_chat_id,
        user_id,
      });

      await private_message.save();

      return res.status(200).json({
        isCreatedPrivateMessageSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
