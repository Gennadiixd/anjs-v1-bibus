import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { getUserQueryHandler } from "queries/handlers/get-user";
import { SuccessResponse } from "utils/responses";

import { loggerAspect } from "../../../aspects";

import { GetUserParamsSchema, GetUserResponseSchema } from "./req-res";

const handlerWithAspects = loggerAspect(getUserQueryHandler);

export const getUser = async (app: FastifyInstance, path: string = "/:id") => {
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
    async (request) => {
      const result = await handlerWithAspects({
        type: "getUserQuery",
        data: {
          userId: request.params.id,
        },
        meta: {
          userId: request.params.id,
          createdAt: new Date(),
          traceId: request.id,
        },
      });

      return SuccessResponse.create(request.id, result);
    }
  );
};
