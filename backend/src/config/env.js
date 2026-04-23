function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 5000),
    corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
    jwtSecret: requiredEnv("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    db: {
      host: requiredEnv("DB_HOST"),
      port: Number(process.env.DB_PORT || 5432),
      name: requiredEnv("DB_NAME"),
      user: requiredEnv("DB_USER"),
      password: requiredEnv("DB_PASSWORD")
    }
  };
}

module.exports = { getEnv };

