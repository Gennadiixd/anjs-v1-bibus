import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { User } from "models/user";
import { SuccessResponse, SuccessResponseR } from "utils/responses";

import { GetUserParamsSchema, GetUserResponseSchema } from "./req-res";

export const getUser = async (
  app: FastifyInstance,
  path: string = "/get-user"
) => {
  app.get<{
    Params: FromSchema<typeof GetUserParamsSchema>;
    Reply: FromSchema<typeof GetUserResponseSchema["200"]>;
  }>(
    path,
    {
      schema: {
        params: GetUserParamsSchema,
        response: GetUserResponseSchema,
      },
    },
    async (request): Promise<SuccessResponseR<User>> => {
      const user = await User.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!user) {
        throw new Error(`There is no user with this id`);
      }

      return SuccessResponse.create(request.id, user);
    }
  );
};
