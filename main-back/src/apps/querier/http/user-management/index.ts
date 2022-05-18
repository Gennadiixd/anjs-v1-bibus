import { FastifyInstance } from "fastify";

import getUser from "./get-user";

// extract function for open telemetry logs name
function userManagementDomainRoutesHandlers(
  appRoutes: any,
  opts: any,
  done: any
) {
  getUser(appRoutes);

  done();
}

export const initUserManagementDomainRoutes = (
  app: FastifyInstance
  // prefix: string = "/user-management"
) => {
  app.register(
    userManagementDomainRoutesHandlers
    // { prefix }
  );
};
