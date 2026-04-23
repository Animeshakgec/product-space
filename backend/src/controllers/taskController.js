const { Task } = require("../models");
const { AppError } = require("../utils/AppError");
const { asyncHandler } = require("../utils/asyncHandler");

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({
    title,
    description: description || null,
    userId: req.user.id
  });

  res.status(201).json({ task });
});

const listMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]]
  });

  res.json({ tasks });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await Task.findOne({ where: { id, userId: req.user.id } });
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  task.status = status;
  await task.save();

  res.json({ task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedCount = await Task.destroy({ where: { id, userId: req.user.id } });
  if (deletedCount === 0) {
    throw new AppError("Task not found", 404);
  }

  res.status(204).send();
});

module.exports = { createTask, listMyTasks, updateTaskStatus, deleteTask };

