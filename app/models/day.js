const sequelize = require("../client");
const { DataTypes, Model } = require("sequelize");

class Day extends Model { };

Day.init(
  {
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: "day"
  }
);

module.exports = Day;