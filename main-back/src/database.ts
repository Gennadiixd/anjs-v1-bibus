import { config } from "config";
import knex from "knex";
import { logger } from "logger";

export const knexConnection = knex({
  client: "pg",
  debug: true,
  log: logger,
  connection: {
    connectionString: config.db.connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  searchPath: ["knex", "public"],
});
