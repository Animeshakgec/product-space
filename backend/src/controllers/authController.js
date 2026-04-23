const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getEnv } = require("../config/env");
const { User } = require("../models");
const { AppError } = require("../utils/AppError");
const { asyncHandler } = require("../utils/asyncHandler");

const env = getEnv();

function signToken(userId) {
  return jwt.sign({}, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn
  });
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user.id);

  res.status(201).json({ user, token });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.scope("withPasswordHash").findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const ok = await bcrypt.compare(String(password), String(user.passwordHash));
  if (!ok) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user.id);
  res.json({ user: user.toJSON(), token });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { signup, login, me };

