const Day = require('./day');
const Month = require('./month');
const Smoked = require('./smoked');
const User = require('./user');
const Year = require('./year');

Day.belongsTo(Month, {
  as: "day",
  foreignKey: "month_id"
});

Month.hasMany(Day, {
  as: "days",
  foreignKey: "month_id"
});

Month.belongsTo(Year, {
  as: "month",
  foreignKey: "year_id"
});

Year.hasMany(Month, {
  as: "monthes",
  foreignKey: "year_id"
});

Smoked.belongsTo(Day, {
  as: "smoked_day",
  foreignKey: "day_id"
});

Day.hasMany(Smoked, {
  as: "somked_day",
  foreignKey: "day_id"
});

Smoked.belongsTo(User, {
  as: "smoked_user",
  foreignKey: "user_id"
});

User.hasMany(Smoked, {
  as: "user",
  foreignKey: "user_id"
});

module.exports = {
  Day,
  Month,
  Smoked,
  User,
  Year
};