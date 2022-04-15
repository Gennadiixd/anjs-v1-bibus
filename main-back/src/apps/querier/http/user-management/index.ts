import { FastifyInstance } from "fastify";

import getUser from "./get-user";

export const initUserManagementDomainRoutes = (
  app: FastifyInstance
  // prefix: string = "/user-management"
) => {
  app.register(
    (appRoutes, opts, done) => {
      getUser(appRoutes);

      done();
    }
    // { prefix }
  );
};
