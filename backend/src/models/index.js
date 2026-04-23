const { sequelize } = require("../config/database");
const { initUser, User } = require("./User");
const { initTask, Task } = require("./Task");

function initModels() {
  initUser(sequelize);
  initTask(sequelize);

  User.hasMany(Task, { foreignKey: "userId", as: "tasks", onDelete: "CASCADE" });
  Task.belongsTo(User, { foreignKey: "userId", as: "user" });

  return { User, Task };
}

module.exports = { sequelize, initModels, User, Task };

