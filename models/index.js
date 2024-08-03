const sequelize = require('../config/db');
const User = require('./userModel');
const Task = require('./taskModel');

sequelize.sync().then(() => {
  console.log('Database & tables created!');
});

module.exports = { User, Task };
