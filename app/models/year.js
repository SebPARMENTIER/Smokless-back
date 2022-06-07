const { DataTypes, Model } = require('sequelize');
const sequelize = require('../client');

class Year extends Model { }

Year.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'year',
  },
);

module.exports = Year;
