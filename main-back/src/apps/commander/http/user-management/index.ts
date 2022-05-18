import { FastifyInstance } from "fastify";

import changeRoleByUser from "./change-role-by-user";

// extract function for open telemetry logs name
function userManagementDomainRoutesHandlers(
  appRoutes: any,
  opts: any,
  done: any
) {
  changeRoleByUser(appRoutes);

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
