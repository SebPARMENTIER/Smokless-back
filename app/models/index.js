const Day = require('./day');
const Month = require('./month');
const Consumption = require('./consumption');
const User = require('./user');
const Year = require('./year');

Day.belongsTo(Month, {
  as: 'month',
  foreignKey: 'month_id',
});

Month.hasMany(Day, {
  as: 'days',
  foreignKey: 'month_id',
});

Month.belongsTo(Year, {
  as: 'year',
  foreignKey: 'year_id',
});

Year.hasMany(Month, {
  as: 'monthes',
  foreignKey: 'year_id',
});

Consumption.belongsTo(Day, {
  as: 'day',
  foreignKey: 'day_id',
});

Day.hasMany(Consumption, {
  as: 'consumption_days',
  foreignKey: 'day_id',
});

Consumption.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id',
});

User.hasMany(Consumption, {
  as: 'consumption',
  foreignKey: 'user_id',
});

module.exports = {
  Day,
  Month,
  Consumption,
  User,
  Year,
};
