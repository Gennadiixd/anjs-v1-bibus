// eslint-disable-next-line import/order
import dotenv from "dotenv";

dotenv.config();

// eslint-disable-next-line import/order
import { initTracing } from "./tracing";

initTracing({
  // consoleTracerEnabled: !!process.env.CONSOLE_TRACER_ENABLED,
  // tracingEnabled: !!process.env.TRACING_ENABLED,
  consoleTracerEnabled: true,
  tracingEnabled: true,
  serviceName: process.env.SERVICE_NAME || "querier",
  env: process.env.NODE_ENV,
  serviceVersion: process.env.SERVICE_VERSION,
});

import knex from "knex";
import { initLogger, pinoLogger } from "libs/@bibus/logger";

import { asyncDbLocalStorage } from "../../libs/@bibus/db-main/knex-context";
import { ReactiveCounter } from "../../libs/reactive-counter";

import { config } from "./config";
import { app } from "./fastify-app";
import { gracefulShutdownC } from "./gracefull-shutdown";

const main = async () => {
  // . LOGGER
  initLogger(config);

  // . DB
  const knexConnection = knex({
    client: "pg",
    debug: true,
    log: pinoLogger,
    connection: {
      connectionString: config.db.connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    searchPath: ["knex", "public"],
  });

  // . REACTIVE COUNTER
  const reactiveCounter = ReactiveCounter.new();

  app.addHook("onRequest", (request, reply, done) => {
    reactiveCounter.increment();
    done();
  });

  app.addHook("onResponse", (request, reply, done) => {
    reactiveCounter.decrement();
    done();
  });

  await asyncDbLocalStorage.run({ knexConnection }, async () => {
    await app.listen(config.querier.http.port, "0.0.0.0");
  });

  const gracefulShutdown = gracefulShutdownC(knexConnection, reactiveCounter);

  process.on("SIGINT", () => {
    app.close();
    gracefulShutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    app.close();
    gracefulShutdown("SIGTERM");
  });
};

main()
  .then(() => {
    console.log(`app listen on port ${config.querier.http.port}`);
  })
  .catch((e) => {
    if (pinoLogger) {
      pinoLogger.error(e);
    } else {
      console.log(e);
    }

    process.exit(1);
  });
