const sequelize = require("../client");
const { DataTypes, Model } = require("sequelize");

class Smoked extends Model { };

Smoked.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: "smoked"
  }
);

module.exports = Smoked;