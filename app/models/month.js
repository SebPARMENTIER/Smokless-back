const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Month extends Model { }

Month.init(
  {
    month: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'month',
  },
);

module.exports = Month;
