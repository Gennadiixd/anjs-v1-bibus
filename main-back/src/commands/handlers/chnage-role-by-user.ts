import { UserId } from "commands/models/user/user";
import { Command } from "utils/cqrs";

import { knexConnection } from "../../database";
import { UserTableRole } from "../../utils/introspected-schema";
import { UserKnexTable } from "../models/user/user.ds";

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
  const { newRole, userIdRoleToBeChanged } = command.data;

  UserKnexTable(knexConnection)
    .where("userId", userIdRoleToBeChanged)
    .update({ role: newRole });
};
