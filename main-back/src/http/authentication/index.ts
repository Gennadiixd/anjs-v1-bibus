import { emailSender } from "email-sender";
import { FastifyInstance } from "fastify";

import { initLoginHandler } from "./login";
import { initLogoutHandler } from "./logout";
import { initRegisterHandler } from "./register";
import { initRequestTokenHandler } from "./request-token";

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
