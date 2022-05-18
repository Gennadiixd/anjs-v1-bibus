import Fastify, { FastifyInstance } from "fastify";
import { pinoLogger } from "libs/@bibus/logger";
import { v4 } from "uuid";

import { config } from "./config";
import { initUserManagementDomainRoutes } from "./http/user-management";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const app: FastifyInstance = Fastify({
  logger: config.logger.active && pinoLogger,
  genReqId: () => v4(),
});

app.register(async (childServer, opts, done) => {
  childServer.register(
    (userRoutes, opts, done) => {
      initUserManagementDomainRoutes(userRoutes);

      done();
    },
    { prefix: "/user-management" }
  );

  done();
});
