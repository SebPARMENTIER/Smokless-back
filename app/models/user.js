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
    average: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user',
  },
);

module.exports = User;
