import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

import { EmailSender } from "../email-sender";

import { register } from "./handler";
import { AuthRegisterBodySchema, AuthRegisterResponsesSchema } from "./req-res";

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
