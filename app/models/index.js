const Consumption = require('./consumption');
const Day = require('./day');
const Chat = require('./chat');
const Message = require('./message');
const Month = require('./month');
const User = require('./user');
const Year = require('./year');

Message.belongsTo(Chat, {
  as: 'general_chat',
  foreignKey: 'general_chat_id',
});

Chat.hasMany(Message, {
  as: 'general_messages',
  foreignKey: 'general_chat_id',
});

Message.belongsTo(User, {
  as: 'user_general_message',
  foreignKey: 'user_id',
});

User.hasMany(Message, {
  as: 'user_general_messages',
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
  Consumption,
  Day,
  Chat,
  Message,
  Month,
  User,
  Year,
};
