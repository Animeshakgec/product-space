const { validationResult } = require("express-validator");
const { AppError } = require("../utils/AppError");

function validate(req, _res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new AppError("Validation failed", 400, { errors }));
  }
  return next();
}

module.exports = { validate };
