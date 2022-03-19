import { FastifyInstance } from "fastify";

import { initChangeEmailByUser } from "./change-email-by-user";
import { initChangeRoleByUser } from "./change-role-by-user";
import { getMe } from "./get-me";
import { getUser } from "./get-user";

export const initUserManagementDomainRoutes = (
  app: FastifyInstance,
  privateKey: string,
  prefix: string = "/user-management"
) => {
  app.register(
    (authRoutes, opts, done) => {
      getUser(authRoutes);

      getMe(authRoutes);

      initChangeRoleByUser(authRoutes, privateKey);

      initChangeEmailByUser(authRoutes);

      done();
    },
    {
      prefix,
    }
  );
};
