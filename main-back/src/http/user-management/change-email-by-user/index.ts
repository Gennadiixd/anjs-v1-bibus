import {
  ChangeUserByEmailBodySchema,
  ChangeUserByEmailResponsesSchema,
} from "http/user-management/change-email-by-user/req-res";

import {
  ChangeEmailByUserCommandData,
  changeEmailByUserCommandHandler,
} from "commands/handlers/change-email-by-user";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { Email } from "utils/branded-types";
import { SuccessResponse, SuccessResponseWR } from "utils/responses";

import { UserId } from "../../../commands/models/user/user";

export const initChangeEmailByUser = (
  app: FastifyInstance,
  path: string = "/email"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserByEmailBodySchema>;
    Reply: FromSchema<typeof ChangeUserByEmailResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserByEmailBodySchema,
        response: ChangeUserByEmailResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      const { userId } = request;
      const newEmail = request.body["new-email"];

      if (!userId) {
        throw new Error(`UserId must exist`);
      }
      // задача http хендлера смапить данные из запроса в хендлер команды

      changeEmailByUserCommandHandler({
        type: "ChangeEmailByUserCommand",
        data: ChangeEmailByUserCommandData.new(
          Email.ofString(newEmail),
          UserId.ofString(userId)
        ),
        meta: {
          userId: UserId.ofString(userId),
          createdAt: new Date(),
          traceId: request.id,
        },
      });

      return SuccessResponse.create(request.id);
    }
  );
};
