const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Message extends Model { }

Message.init(
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'message',
  },
);

module.exports = Message;
