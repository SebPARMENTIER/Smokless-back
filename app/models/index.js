const Day = require('./day');
const Month = require('./month');
const Smoked = require('./smoked');
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

Smoked.belongsTo(Day, {
  as: 'day',
  foreignKey: 'day_id',
});

Day.hasMany(Smoked, {
  as: 'smoked_days',
  foreignKey: 'day_id',
});

Smoked.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id',
});

User.hasMany(Smoked, {
  as: 'consumption',
  foreignKey: 'user_id',
});

module.exports = {
  Day,
  Month,
  Smoked,
  User,
  Year,
};
