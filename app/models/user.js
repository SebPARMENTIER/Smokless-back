const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class User extends Model { }

User.init(
  {
    pseudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user',
  },
);

module.exports = User;
