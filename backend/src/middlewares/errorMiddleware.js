const { AppError } = require("../utils/AppError");

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const isSequelizeValidation = err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError";
  if (isSequelizeValidation) {
    const errors = (err.errors || []).map((e) => ({ field: e.path, message: e.message }));
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (err instanceof AppError) {
    const payload = { message };
    if (err.details && typeof err.details === "object") {
      Object.assign(payload, err.details);
    }
    return res.status(statusCode).json(payload);
  }

  // Default (avoid leaking internals in production)
  const safeMessage = process.env.NODE_ENV === "production" ? "Internal Server Error" : message;
  return res.status(statusCode).json({ message: safeMessage });
}

module.exports = { errorHandler };
