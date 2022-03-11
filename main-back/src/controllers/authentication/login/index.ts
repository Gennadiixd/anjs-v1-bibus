import { login } from "controllers/authentication/login/handler";
import {
  LoginBodySchema,
  LoginResponsesSchema,
} from "controllers/authentication/login/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const initLoginHandler = (
  app: FastifyInstance,
  privateKey: string,
  path: string = "/login"
) => {
  app.post<{
    Body: FromSchema<typeof LoginBodySchema>;
    Reply: FromSchema<typeof LoginResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: LoginBodySchema,
        response: LoginResponsesSchema,
      },
    },
    login(privateKey)
  );
};
