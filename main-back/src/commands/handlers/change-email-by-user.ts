import { User, UserId } from "commands/models/user";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

import { assignUserEmailToUser } from "../operations/assign-user-email-to-user";
import { createTempToken } from "../operations/create-temp-token";
import { createUserEmail } from "../operations/create-user-email";

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
  command: ChangeEmailByUserCommand
): Promise<void> => {
  const { newEmail, userIdEmailToBeChanged } = command.data;

  // . Get user
  const user = await User.findOne(userIdEmailToBeChanged);

  if (!user) {
    throw new Error(`User must exist`);
  }

  // . Make main email not main
  const [mainEmail] = user.emails.filter((email) => email.main);

  if (!mainEmail) {
    throw new Error(`There is no main email`);
  }

  mainEmail.main = false;

  const userEmail = createUserEmail(user, newEmail);
  const tempToken = createTempToken(userEmail);

  await assignUserEmailToUser(user, tempToken, userEmail);

  // . Save user
  await user.save();
};
