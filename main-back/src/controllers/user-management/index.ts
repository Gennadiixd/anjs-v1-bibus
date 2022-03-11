import { initChangeEmailByUser } from "controllers/user-management/change-email-by-user";
import { initChangeRoleByUser } from "controllers/user-management/change-role-by-user";
import { getMe } from "controllers/user-management/get-me";
import { getUser } from "controllers/user-management/get-user";
import { FastifyInstance } from "fastify";

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
