import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

import {
  changeRoleByUserCommandHandler,
  ChangeRoleByUserCommandData,
} from "../../../../../commands/handlers/change-role-by-user";
import { UserRole, UserId } from "../../../../../commands/models/user/user";
import {
  SuccessResponse,
  SuccessResponseWR,
} from "../../../../../libs/@bibus/responses";

import {
  ChangeUserRoleBodySchema,
  ChangeUserRoleResponsesSchema,
} from "./req-res";

const changeRoleByUser = (app: FastifyInstance, path: string = "/email") => {
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
      const { id: userId } = request;
      const newRole = request.body["new-role"];
      const { userIdRoleToBeChanged } = request.body;

      if (!userId) {
        throw new Error(`UserId must exist`);
      }

      changeRoleByUserCommandHandler({
        type: "ChangeRoleByUserCommand",
        data: ChangeRoleByUserCommandData.new(
          UserRole.ofString(newRole),
          UserId.ofString(userIdRoleToBeChanged)
        ),
        meta: {
          userId: UserId.ofString(userId),
          createdAt: new Date(),
          transactionId: "1",
        },
      });

      return SuccessResponse.create(request.id);
    }
  );
};

export default changeRoleByUser;
