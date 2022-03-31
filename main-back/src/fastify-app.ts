import { initAuthDomainRoutes } from "http/authentication";

import { config } from "config";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import { JWTToken } from "utils/jwt-tokens";
import { v4 } from "uuid";

import { JwtTokenId } from "./commands/models/jwt-token/jwt-token";
import { JwtTokenDataService } from "./commands/models/jwt-token/jwt-token.ds";
import { UserId } from "./commands/models/user/user";
import { UserDataService } from "./commands/models/user/user.ds";
import { knexConnection } from "./database";
import { logger } from "./logger";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const app: FastifyInstance = Fastify({
  logger: config.logger.active && logger,
  genReqId: () => v4(),
});

// . SWAGGER
if (config.http.swagger.active) {
  app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: "/documentation",
    openapi: {
      info: {
        title: "bibus",
        version: "1",
      },
    },
  });
}

// . SCHEMA
app.addSchema({
  $id: "authSchema",
  type: "object",
  properties: {
    Authorization: {
      type: "string",
      description:
        "Authorization header (ex. `Authorization: Bearer ${token}`)",
    },
  },
});

app.decorateRequest("userId", "");

// . ROUTER
// . AUTH PREFIX
initAuthDomainRoutes(app, config.jwtToken.secret);

// . AUTHENTICATED
app.register(async (childServer, opts, done) => {
  // . AUTH MIDDLEWARE
  childServer.addHook("onRequest", async (request) => {
    if (
      request.url.includes("documentation") ||
      request.url.includes("health")
    ) {
      return;
    }

    const headerToken = request.headers.authorization;

    if (!headerToken) {
      throw new Error(`Permission denied`);
    }

    const token = headerToken.split("Bearer ")[1];

    if (!token) {
      throw new Error(`Permission denied`);
    }

    const decoded = JWTToken.verify(config.jwtToken.secret, token);

    const user = await UserDataService.findById(
      knexConnection,
      UserId.ofString(decoded.userId)
    );

    if (!user) {
      throw new Error(`Permission denied`);
    }

    const jwtToken = await JwtTokenDataService.findById(
      knexConnection,
      JwtTokenId.ofString(decoded.id)
    );

    if (jwtToken?.state.__type !== "JwtTokenStateActive") {
      throw new Error(`Permission denied`);
    }

    // eslint-disable-next-line require-atomic-updates
    request.userId = user.id;
  });

  childServer.register(
    (userRoutes, opts, done) => {
      initAuthDomainRoutes(userRoutes, config.jwtToken.secret);

      done();
    },
    { prefix: "/user-management" }
  );

  done();
});
