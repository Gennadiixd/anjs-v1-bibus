import "reflect-metadata";
import { JwtToken } from "commands/models/jwt-token";
import { TempToken } from "commands/models/temp-token";
import { User } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
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
    entities: [User, UserEmail, TempToken, JwtToken],
    synchronize: true,
    logging: true,
  });

  await app.listen(config.http.port, "0.0.0.0");
})();
