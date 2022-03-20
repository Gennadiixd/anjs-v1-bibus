import { knexConnection } from "database";
import { QueryResult } from "pg";
import {
  UserTableName,
  UserTableColumnNames,
  UserEmailTableName,
  UserEmailTableColumnNames,
  UserEmailTableValue,
  UserTableCreatedAt,
  UserTableId,
  UserTableRole,
} from "utils/introspected-schema";

export type getUserQuery = {
  _result?: UserFromQuery;
  type: "getUserQuery";
  data: {
    userId: string;
  };
  meta: {
    userId: string | null;
    createdAt: Date;
    parentTraceId?: string;
    traceId: string;
  };
};

type UserFromQuery = {
  id: UserTableId;
  role: UserTableRole;
  email: UserEmailTableValue;
  createdAt: string;
};

type UserFromDB = {
  id: UserTableId;
  role: UserTableRole;
  email: UserEmailTableValue;
  createdAt: UserTableCreatedAt;
};

const emailDateColumnName = "email";

export const getUserQueryHandler = async (
  query: getUserQuery
): Promise<UserFromQuery> => {
  const result = await knexConnection.raw<QueryResult<UserFromDB>>(
    `
    SELECT
      ${UserTableName}.${UserTableColumnNames.id},
      ${UserTableName}.${UserTableColumnNames.role},
      ${UserTableName}."${UserTableColumnNames.createdAt}",
      ${UserEmailTableName}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}
    FROM public.${UserTableName} ${UserTableName}
    LEFT JOIN ${UserEmailTableName} ${UserEmailTableName} ON ${UserEmailTableName}."${UserEmailTableColumnNames.userId}" = ${UserTableName}.${UserTableColumnNames.id}
    WHERE ${UserTableName}.${UserTableColumnNames.id} = ? AND ${UserEmailTableName}.${UserEmailTableColumnNames.main} = true;
  `
  );

  const [user] = result.rows;

  if (!user) {
    throw new Error(`There is no user with this id`);
  }

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
};
