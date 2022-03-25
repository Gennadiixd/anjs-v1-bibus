import { User, UserId, UserRole } from "commands/models/user";
import { Command } from "utils/cqrs";

export type ChangeRoleByUserCommandData = {
  newRole: UserRole;
  userIdRoleToBeChanged: UserId;
};

export type ChangeRoleByUserCommand = Command<
  "ChangeRoleByUserCommand",
  ChangeRoleByUserCommandData
>;

export const ChangeRoleByUserCommandData = {
  new: (
    newRole: UserRole,
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

  const user = await User.findOne(userIdRoleToBeChanged);

  if (!user) {
    throw new Error(`User must exist`);
  }

  user.role = newRole;
  await user.save();
};
