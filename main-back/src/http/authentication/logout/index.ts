import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

import { logout } from "./handler";
import { LogoutResponsesSchema } from "./req-res";

export const initLogoutHandler = (
  app: FastifyInstance,
  path: string = "/logout"
) => {
  app.post<{
    Reply: FromSchema<typeof LogoutResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: LogoutResponsesSchema,
      },
    },
    logout
  );
};
