const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class General_chat extends Model { }

General_chat.init(
  {
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'general_chat',
  },
);

module.exports = General_chat;
