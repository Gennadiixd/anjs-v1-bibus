import { EmailSender } from "controllers/authentication/email-sender";
import { register } from "controllers/authentication/register/handler";
import {
  AuthRegisterBodySchema,
  AuthRegisterResponsesSchema,
} from "controllers/authentication/register/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

export const initRegisterHandler = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/register",
  method: "post" | "get" = "post"
) => {
  app[method]<{
    Body: FromSchema<typeof AuthRegisterBodySchema>;
    Reply: FromSchema<typeof AuthRegisterResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthRegisterBodySchema,
        response: AuthRegisterResponsesSchema,
      },
    },
    register(emailSender)
  );
};
