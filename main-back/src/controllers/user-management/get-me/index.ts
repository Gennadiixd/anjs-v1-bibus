import { FastifyInstance, FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "models/user";
import { SuccessResponse, SuccessResponseR } from "utils/responses";

import { GetUserResponseSchema } from "./req-res";

export const getMe = async (app: FastifyInstance, path: string = "/get-me") => {
  app.get<{
    Reply: FromSchema<typeof GetUserResponseSchema["200"]>;
  }>(
    path,
    {
      schema: {
        response: GetUserResponseSchema,
      },
    },
    async (request: FastifyRequest): Promise<SuccessResponseR<User>> => {
      if (!request.userId) {
        throw new Error(`Permission denied`);
      }

      const user = await User.findOne({
        where: {
          id: request.userId,
        },
      });

      if (!user) {
        throw new Error(`There is no user with this id`);
      }

      return SuccessResponse.create(request.id, user);
    }
  );
};
