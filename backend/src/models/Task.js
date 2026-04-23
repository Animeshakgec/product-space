const { DataTypes, Model } = require("sequelize");

class Task extends Model {}

function initTask(sequelize) {
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING"
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
      indexes: [{ fields: ["userId"] }, { fields: ["userId", "status"] }]
    }
  );

  return Task;
}

module.exports = { Task, initTask };

