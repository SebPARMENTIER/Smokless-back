const { Model } = require('sequelize');
const sequelize = require('../client');

class Private_chat extends Model { }

Private_chat.init(
  {
    sequelize,
    tableName: 'private_chat',
  },
);

module.exports = Private_chat;
