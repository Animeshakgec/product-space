const express = require("express");
const { body } = require("express-validator");
const { signup, login, me } = require("../controllers/authController");
const { validate } = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").optional().isLength({ max: 120 }).withMessage("Name too long"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    validate
  ],
  signup
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty().withMessage("Password required"), validate],
  login
);

router.get("/me", requireAuth, me);

module.exports = { authRoutes: router };

