const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Consumption extends Model { }

Consumption.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'consumption',
  },
);

module.exports = Consumption;
