import { User, UserId, UserRole } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { emailSender } from "email-sender";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

import { assignMainEmailToUser } from "../operations/assign-main-email-to-user";

export type RegisterUserCommandData = {
  email: Email;
};

export type RegisterUserCommand = Command<
  "RegisterUserCommand",
  RegisterUserCommandData
>;

export const RegisterUserCommandData = {
  new: (email: Email): RegisterUserCommandData => {
    return { email };
  },
};

export const registerUserCommandHandler = async (
  command: RegisterUserCommand
): Promise<void> => {
  const { email } = command.data;

  // . Check email
  const [emailFromDB] = await UserEmail.find({ value: email });

  if (emailFromDB) {
    throw new Error(`User with email ${email} already exist`);
  }

  // . Create new user, email and passwordless token
  const user = new User();
  user.id = UserId.new();
  user.role = UserRole.USER;
  user.emails = [];
  user.jwtTokens = [];

  await assignMainEmailToUser(user, email);

  await user.save();

  // . Send token to email
  const token = await user.lastTempToken();
  const [createdEmail] = await UserEmail.find({ value: email });

  if (!token || !createdEmail) {
    throw new Error("Something went wrong");
  }

  await emailSender.sendEmail(`Your token is ${token.id}`, createdEmail.value);
};
