import { EmailSender } from "controllers/authentication/email-sender";
import { requestToken } from "controllers/authentication/request-token/handler";
import {
  AuthRequestTokenBodySchema,
  AuthRequestTokenResponsesSchema,
} from "controllers/authentication/request-token/req-res";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

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
