const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Smoked extends Model { }

Smoked.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'smoked',
  },
);

module.exports = Smoked;
