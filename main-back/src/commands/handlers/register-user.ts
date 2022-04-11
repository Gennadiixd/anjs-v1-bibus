import { UserId } from "commands/models/user/user";
import { emailSender } from "email-sender";
import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

import { knexConnection } from "../../database";
import { TempTokenId } from "../models/temp-token/temp-token";
import { TempTokenDataService } from "../models/temp-token/temp-token.ds";
import { UserEmailId } from "../models/user-email/user-email";
import {
  UserEmailDataService,
  UserEmailKnexTable,
} from "../models/user-email/user-email.ds";
import { UserRole } from "../models/user/user";
import { UserDataService } from "../models/user/user.ds";

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

  const emailFromDB = await UserEmailKnexTable(knexConnection)
    .where({ value: email })
    .first();

  if (emailFromDB) {
    throw new Error(`User with email ${email} already exist`);
  }

  // Create new User
  const userIdToBeCreated = UserId.new();

  UserDataService.insert(knexConnection, {
    id: userIdToBeCreated,
    role: UserRole.newUser(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create new UserEmail
  const userEmailIdToBeCreated = UserEmailId.new();

  UserEmailDataService.insert(knexConnection, {
    main: true,
    id: userEmailIdToBeCreated,
    userId: userIdToBeCreated,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: {
      __type: "UserEmailStateInactivated",
      value: email,
      activated: false,
    },
  });

  // Create new token
  TempTokenDataService.insert(knexConnection, {
    id: TempTokenId.new(),
    used: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userEmailId: userEmailIdToBeCreated,
  });

  await emailSender.sendEmail(
    `Your token is ${userIdToBeCreated}`,
    userEmailIdToBeCreated
  );
};
