const Consumption = require('./consumption');
const Day = require('./day');
const General_chat = require('./general_chat');
const General_message = require('./general_message');
const Month = require('./month');
const Private_chat = require('./private_chat');
const Private_message = require('./private_message');
const User = require('./user');
const Year = require('./year');

General_message.belongsTo(General_chat, {
  as: 'general_chat',
  foreignKey: 'general_message_id',
});

General_chat.hasMany(General_message, {
  as: 'general_messages',
  foreignKey: 'general_message_id',
});

General_message.belongsTo(User, {
  as: 'user_general_message',
  foreignKey: 'user_id',
});

User.hasMany(General_message, {
  as: 'user_general_messages',
  foreignKey: 'user_id',
});

Private_message.belongsTo(Private_chat, {
  as: 'private_chat',
  foreignKey: 'private_chat_id',
});

Private_chat.hasMany(Private_message, {
  as: 'private_messages',
  foreignKey: 'privete_chat_id',
});

Private_message.belongsTo(User, {
  as: 'user_private_message',
  foreignKey: 'user_id',
});

User.hasMany(Private_message, {
  as: 'user_private_messages',
  foreignKey: 'user_id',
});

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
