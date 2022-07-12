const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Chat extends Model { }

Chat.init(
  {
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'chat',
  },
);

module.exports = Chat;
