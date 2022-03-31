import { Knex } from "knex";
import { UserTable, UserTableName } from "utils/introspected-schema";

import { User, UserId } from "./user";

export const UserDataMapper = {
  fromModel: (user: User): UserTable => {
    return user;
  },
  toModel: (userTable: UserTable): User => {
    return {
      ...userTable,
      // Trustable DB,
      id: userTable.id as UserId,
    };
  },
};

export const UserKnexTable = (knex: Knex) => knex<UserTable>(UserTableName);

export const findById = async (
  knex: Knex,
  id: UserId
): Promise<User | undefined> => {
  const userTable = await UserKnexTable(knex).where({ id }).first();

  return userTable ? UserDataMapper.toModel(userTable) : undefined;
};

export const update = async (knex: Knex, user: User): Promise<void> => {
  await UserKnexTable(knex)
    .where({ id: user.id })
    .update(UserDataMapper.fromModel(user));
};

export const insert = async (knex: Knex, user: User): Promise<void> => {
  await UserKnexTable(knex).insert(UserDataMapper.fromModel(user));
};

export const UserDataService = {
  findById,
  update,
  insert,
  // remove
};
