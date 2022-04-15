import { FastifyInstance } from "fastify";

import changeRoleByUser from "./change-role-by-user";

export const initUserManagementDomainRoutes = (
  app: FastifyInstance
  // prefix: string = "/user-management"
) => {
  app.register(
    (authRoutes, opts, done) => {
      changeRoleByUser(authRoutes);

      done();
    }
    // { prefix }
  );
};
