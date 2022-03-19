import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

import { EmailSender } from "../email-sender";

import { requestToken } from "./handler";
import {
  AuthRequestTokenBodySchema,
  AuthRequestTokenResponsesSchema,
} from "./req-res";

export const initRequestTokenHandler = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/request-token"
) => {
  app.post<{
    Body: FromSchema<typeof AuthRequestTokenBodySchema>;
    Reply: FromSchema<typeof AuthRequestTokenResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthRequestTokenBodySchema,
        response: AuthRequestTokenResponsesSchema,
      },
    },
    requestToken(emailSender)
  );
};
