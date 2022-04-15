import { UserId } from "commands/models/user/user";

import {
  UserTable,
  UserTableName,
  UserTableRole,
} from "../../libs/@bibus/db-main/introspected-schema";
import { getDbContext } from "../../libs/@bibus/db-main/knex-context";
import { Command } from "../../libs/cqrs";

export type ChangeRoleByUserCommandData = {
  newRole: UserTableRole;
  userIdRoleToBeChanged: UserId;
};

export type ChangeRoleByUserCommand = Command<
  "ChangeRoleByUserCommand",
  ChangeRoleByUserCommandData
>;

export const ChangeRoleByUserCommandData = {
  new: (
    newRole: UserTableRole,
    userIdRoleToBeChanged: UserId
  ): ChangeRoleByUserCommandData => {
    return {
      newRole,
      userIdRoleToBeChanged,
    };
  },
};

export const changeRoleByUserCommandHandler = async (
  command: ChangeRoleByUserCommand
): Promise<void> => {
  const { knexConnection } = getDbContext();

  const { newRole, userIdRoleToBeChanged } = command.data;

  await knexConnection<UserTable>(UserTableName)
    .where("id", userIdRoleToBeChanged)
    .update({ role: newRole });
};
