const { Model, DataTypes } = require('sequelize');
const sequelize = require('../client');

class Private_chat extends Model { }

Private_chat.init(
  {
    subject: {
      type: DataTypes.TEXT,
      defaultValue: 'Message Privé',
    },
  },
  {
    sequelize,
    tableName: 'private_chat',
  },
);

module.exports = Private_chat;
