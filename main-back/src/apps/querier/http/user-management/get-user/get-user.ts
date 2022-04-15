import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";

// import { loggerAspect } from "../../../../../libs/@bibus/aspects/aspects";
// import { pinoLogger } from "../../../../../libs/@bibus/logger";
import { SuccessResponse } from "../../../../../libs/@bibus/responses";
import getUserQueryHandler from "../../../../../queries/handlers/get-user";

import { GetUserParamsSchema, GetUserResponseSchema } from "./req-res";

// const handlerWithAspects = loggerAspect(pinoLogger)(getUserQueryHandler);

const getUser = async (app: FastifyInstance, path: string = "/:id") => {
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
      const result = await getUserQueryHandler({
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

export default getUser;
