const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Private_message extends Model { }

Private_message.init(
  {
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'private_message',
  },
);

module.exports = Private_message;
