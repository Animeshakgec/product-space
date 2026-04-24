const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const { getEnv } = require("./config/env");
const { apiRoutes } = require("./routes");
const { notFound } = require("./middlewares/notFoundMiddleware");
const { errorHandler } = require("./middlewares/errorMiddleware");
const { buildOpenApiSpec } = require("./docs/swagger");

const env = getEnv();

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => res.json({ ok: true }));

  const serverUrl = `http://localhost:${env.port}`;
  const openApi = buildOpenApiSpec({ serverUrl });
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApi));

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

