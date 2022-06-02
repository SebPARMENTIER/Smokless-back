const sequelize = require("../client");
const { DataTypes, Model } = require("sequelize");

class Month extends Model { };

Month.init(
  {
    month: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: "month"
  }
);

module.exports = Month;