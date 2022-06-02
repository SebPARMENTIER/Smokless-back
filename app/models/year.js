const sequelize = require("../client");
const { DataTypes, Model } = require("sequelize");

class Year extends Model { };

Year.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: "year"
  }
);

module.exports = Year;