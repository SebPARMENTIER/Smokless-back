const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Day extends Model { }

Day.init(
  {
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'day',
  },
);

module.exports = Day;
