const express = require("express");
const { body } = require("express-validator");
const { createTask, listMyTasks, updateTaskStatus, deleteTask } = require("../controllers/taskController");
const { validate } = require("../middlewares/validate");

const router = express.Router();

router.get("/", listMyTasks);

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title required").isLength({ max: 200 }).withMessage("Title too long"),
    body("description").optional().isLength({ max: 5000 }).withMessage("Description too long"),
    validate
  ],
  createTask
);

router.patch(
  "/:id/status",
  [body("status").isIn(["PENDING", "COMPLETED"]).withMessage("Status must be PENDING or COMPLETED"), validate],
  updateTaskStatus
);

router.delete("/:id", deleteTask);

module.exports = { taskRoutes: router };

