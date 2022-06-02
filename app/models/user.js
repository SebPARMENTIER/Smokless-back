const sequelize = require("../client");
const { DataTypes, Model } = require("sequelize");

class User extends Model { };

User.init(
  {
    pseudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "user"
  }
);

module.exports = User;