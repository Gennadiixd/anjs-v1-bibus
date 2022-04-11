import "reflect-metadata";
import { config } from "config";
import { app } from "fastify-app";
import { createConnection } from "typeorm";

(async () => {
  // DB
  await createConnection({
    url: config.db.connectionString,
    type: "postgres",
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    synchronize: true,
    logging: true,
  });

  await app.listen(config.http.port, "0.0.0.0");
})();
