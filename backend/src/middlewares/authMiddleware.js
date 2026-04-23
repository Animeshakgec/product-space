const jwt = require("jsonwebtoken");
const { getEnv } = require("../config/env");
const { User } = require("../models");
const { AppError } = require("../utils/AppError");
const { asyncHandler } = require("../utils/asyncHandler");

const env = getEnv();

const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Unauthorized", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (_err) {
    throw new AppError("Invalid token", 401);
  }

  const user = await User.findByPk(payload.sub);
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  req.user = user;
  next();
});

module.exports = { requireAuth };

