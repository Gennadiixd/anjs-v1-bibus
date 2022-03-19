import { User, UserId } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

// export type ChangeEmailByUserCommand = {
//   type: "ChangeEmailByUserCommand";
//   data: {
//     newEmail: Email;
//     userIdEmailToBeChanged: UserId;
//   };
//   meta: {
//     userId: UserId | null;
//     createdAt: Date;
//     parentTraceId?: string;
//     traceId: string;
//   };
// };

export type ChangeEmailByUserCommandData = {
  newEmail: Email;
  userIdEmailToBeChanged: UserId;
};

export type ChangeEmailByUserCommand = Command<
  "ChangeEmailByUserCommand",
  ChangeEmailByUserCommandData
>;

export const ChangeEmailByUserCommandData = {
  new: (
    newEmail: Email,
    userIdEmailToBeChanged: UserId
  ): ChangeEmailByUserCommandData => {
    return {
      newEmail,
      userIdEmailToBeChanged,
    };
  },
};

export const changeEmailByUserCommandHandler = async (
  changeEmailByUserCommand: ChangeEmailByUserCommand
): Promise<void> => {
  const newEmail = changeEmailByUserCommand.data.newEmail;
  const userIdEmailToBeChanged =
    changeEmailByUserCommand.data.userIdEmailToBeChanged;

  if (
    await UserEmail.findOne({
      where: {
        value: newEmail,
      },
    })
  ) {
    throw new Error(`Email already exist`);
  }

  const user = await User.findOne(userIdEmailToBeChanged);

  if (!user) {
    throw new Error(`User must exist`);
  }

  await user.changeEmail(newEmail);
  await user.save();
};
