import knex from "knex";
import { initLogger, pinoLogger } from "libs/@bibus/logger";

import { asyncDbLocalStorage } from "../../libs/@bibus/db-main/knex-context";

import { config } from "./config";
import { app } from "./fastify-app";

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

  await asyncDbLocalStorage.run({ knexConnection }, async () => {
    await app.listen(config.querier.http.port, "0.0.0.0");
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
