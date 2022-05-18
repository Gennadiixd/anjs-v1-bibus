import { Knex } from "knex";

import {
  UserEmailTable,
  UserEmailTableName,
} from "../../../libs/@bibus/db-main/introspected-schema";
import { UserId } from "../user/user";

import { UserEmail, UserEmailId, UserEmailState } from "./user-email";

export const UserEmailDataMapper = {
  fromModel: (userEmail: UserEmail): UserEmailTable => {
    return {
      id: userEmail.id,
      main: userEmail.main,
      activated: userEmail.state.activated,
      value: userEmail.state.value,
      createdAt: userEmail.createdAt,
      updatedAt: userEmail.updatedAt,
      userId: userEmail.userId,
    };
  },
  toModel: (userEmailTable: UserEmailTable): UserEmail => {
    const { value, activated } = userEmailTable;

    let state: UserEmailState;

    if (value !== null) {
      if (activated) {
        state = {
          __type: "UserEmailStateActivated",
          activated,
          value,
        };
      } else {
        state = {
          __type: "UserEmailStateInactivated",
          activated,
          value,
        };
      }
    } else {
      state = {
        __type: "UserEmailStateEmpty",
        activated: activated as false,
        value,
      };
    }

    return {
      userId: userEmailTable.userId as UserId,
      id: userEmailTable.id as UserEmailId,
      createdAt: userEmailTable.createdAt,
      updatedAt: userEmailTable.updatedAt,
      main: userEmailTable.main,
      state,
    };
  },
};

export const UserEmailKnexTable = (knex: Knex) =>
  knex<UserEmailTable>(UserEmailTableName);

export const findById = async (
  knex: Knex,
  id: UserEmailId
): Promise<UserEmail | undefined> => {
  const userEmailTable = await UserEmailKnexTable(knex).where({ id }).first();

  return userEmailTable
    ? UserEmailDataMapper.toModel(userEmailTable)
    : undefined;
};

export const update = async (
  knex: Knex,
  userEmail: UserEmail
): Promise<void> => {
  await UserEmailKnexTable(knex)
    .where({ id: userEmail.id })
    .update(UserEmailDataMapper.fromModel(userEmail));
};

export const insert = async (
  knex: Knex,
  userEmail: UserEmail
): Promise<void> => {
  await UserEmailKnexTable(knex).insert(
    UserEmailDataMapper.fromModel(userEmail)
  );
};

export const UserEmailDataService = {
  findById,
  update,
  insert,
};
