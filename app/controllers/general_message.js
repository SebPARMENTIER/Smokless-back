const { General_message } = require('../models');

module.exports = {
  createMessage: async (req, res) => {
    try {
      const { message, general_chat_id, user_id } = req.body;

      if (!message || !general_chat_id || !user_id) {
        return res.status(400).json({
          data: [],
          error: 'Vous devez saisir un message, un sujet de chat et un utilisateur',
        });
      }

      const general_message = new General_message({
        message,
        general_chat_id,
        user_id,
      });

      await general_message.save();

      return res.status(200).json({
        isCreatedGeneralMessageSuccess: true,
      });
    } catch (error) {
      return res.status(500).json({
        data: [],
        error: error.message,
      });
    }
  },
};
