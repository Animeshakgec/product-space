require("dotenv").config();

const { createApp } = require("./app");
const { sequelize, initModels } = require("./models");
const { getEnv } = require("./config/env");

async function start() {
  const env = getEnv();
  initModels();

  await sequelize.authenticate();

  // For quick local dev. For production, use migrations instead of sync().
  const shouldAlter = env.nodeEnv !== "production";
  await sequelize.sync({ alter: shouldAlter });

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

