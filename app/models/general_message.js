const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class General_message extends Model { }

General_message.init(
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'general_message',
  },
);

module.exports = General_message;
