import { initLoginHandler } from "controllers/authentication/login";
import { initLogoutHandler } from "controllers/authentication/logout";
import { initRegisterHandler } from "controllers/authentication/register";
import { initRequestTokenHandler } from "controllers/authentication/request-token";
import { emailSender } from "email-sender";
import { FastifyInstance } from "fastify";

export const initAuthDomainRoutes = (
  app: FastifyInstance,
  privateKey: string,
  prefix: string = "/auth"
) => {
  app.register(
    (authRoutes, opts, done) => {
      initRegisterHandler(authRoutes, emailSender, "/register", "post");

      initRequestTokenHandler(authRoutes, emailSender);

      initLoginHandler(authRoutes, privateKey);

      initLogoutHandler(authRoutes);

      done();
    },
    {
      prefix,
    }
  );
};
