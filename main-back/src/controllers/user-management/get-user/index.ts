import { knexConnection } from "database";
import { FastifyInstance } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { QueryResult } from "pg";
import {
  UserTableId,
  UserTableRole,
  UserTableCreatedAt,
  UserEmailTableValue,
  UserTableColumnNames,
  UserEmailTableColumnNames,
  UserTableName,
  UserEmailTableName,
} from "utils/introspected-schema";
import { SuccessResponse, SuccessResponseR } from "utils/responses";

import { GetUserParamsSchema, GetUserResponseSchema } from "./req-res";
import { serializeUser, UserSerialized } from "./serializer";

const emailDateColumnName = "email";

export type UserFromQuery = {
  id: UserTableId;
  role: UserTableRole;
  createdAt: UserTableCreatedAt;
  email: UserEmailTableValue;
};

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
    async (request): Promise<SuccessResponseR<UserSerialized>> => {
      const result = await knexConnection.raw<QueryResult<UserFromQuery>>(
        `
        SELECT
          ${UserTableName}.${UserTableColumnNames.id},
          ${UserTableName}.${UserTableColumnNames.role},
          ${UserTableName}."${UserTableColumnNames.createdAt}",
          ${UserEmailTableName}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}
        FROM public.${UserTableName} ${UserTableName}
        LEFT JOIN ${UserEmailTableName} ${UserEmailTableName} ON ${UserEmailTableName}."${UserEmailTableColumnNames.userId}" = ${UserTableName}.${UserTableColumnNames.id}
        WHERE ${UserTableName}.${UserTableColumnNames.id} = ? AND ${UserEmailTableName}.${UserEmailTableColumnNames.main} = true;
      `,
        [request.params.id]
      );

      const [user] = result.rows;

      if (!user) {
        throw new Error(`There is no user with this id`);
      }

      const userSerialized = serializeUser(user);

      return SuccessResponse.create(request.id, userSerialized);
    }
  );
};
