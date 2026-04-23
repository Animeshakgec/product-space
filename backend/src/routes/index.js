const express = require("express");
const { authRoutes } = require("./authRoutes");
const { taskRoutes } = require("./taskRoutes");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tasks", requireAuth, taskRoutes);

module.exports = { apiRoutes: router };

