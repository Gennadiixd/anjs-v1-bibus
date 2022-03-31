import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { SuccessResponse, SuccessResponseWR } from "utils/responses";

import {
  changeRoleByUserCommandHandler,
  ChangeRoleByUserCommandData,
} from "../../../commands/handlers/chnage-role-by-user";
import { UserId, UserRole } from "../../../commands/models/user/user";

import {
  ChangeUserRoleBodySchema,
  ChangeUserRoleResponsesSchema,
} from "./req-res";

export const initChangeRoleByUser = (
  app: FastifyInstance,
  path: string = "/email"
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserRoleBodySchema>;
    Reply: FromSchema<typeof ChangeUserRoleResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: ChangeUserRoleBodySchema,
        response: ChangeUserRoleResponsesSchema,
      },
    },
    async (request): Promise<SuccessResponseWR> => {
      const { userId } = request;
      const newRole = request.body["new-role"];

      if (!userId) {
        throw new Error(`UserId must exist`);
      }

      changeRoleByUserCommandHandler({
        type: "ChangeRoleByUserCommand",
        data: ChangeRoleByUserCommandData.new(
          UserRole.ofString(newRole),
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
