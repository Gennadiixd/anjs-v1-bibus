import {
  UserTableId,
  UserTableRole,
  UserEmailTableValue,
  UserTableName,
  UserTable,
} from "../../../libs/@bibus/db-main/introspected-schema";
import { getDbContext } from "../../../libs/@bibus/db-main/knex-context";

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
    traceId?: string;
  };
};

type UserFromQuery = {
  id: UserTableId;
  role: UserTableRole;
  email: UserEmailTableValue;
  createdAt: string;
};

const getUserQueryHandler = async (
  query: getUserQuery
): Promise<UserFromQuery> => {
  const { knexConnection } = getDbContext();

  const userTableData = await knexConnection<UserTable>(UserTableName)
    .where({ id: query.data.userId })
    .first();

  if (!userTableData) {
    throw new Error(`There is no user with this id`);
  }

  return {
    id: userTableData.id,
    role: userTableData.role,
    email: "",
    createdAt: userTableData.createdAt.toISOString(),
  };
};

export default getUserQueryHandler;
