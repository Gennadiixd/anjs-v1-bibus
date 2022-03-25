import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { SuccessResponseWR, SuccessResponse } from "utils/responses";

import {
  registerUserCommandHandler,
  RegisterUserCommandData,
} from "../../../commands/handlers/register-user";
import { Email } from "../../../utils/branded-types";
import { EmailSender } from "../email-sender";

import { AuthRegisterBodySchema } from "./req-res";

export const register =
  (emailSender: EmailSender) =>
  async (
    request: FastifyRequest<{
      Body: FromSchema<typeof AuthRegisterBodySchema>;
    }>
  ): Promise<SuccessResponseWR> => {
    const { email } = request.body;

    registerUserCommandHandler({
      type: "RegisterUserCommand",
      data: RegisterUserCommandData.new(Email.ofString(email)),
      meta: { createdAt: new Date(), traceId: request.id, userId: null },
    });

    return SuccessResponse.create(request.id);
  };
