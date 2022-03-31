import { Email } from "utils/branded-types";
import { Command } from "utils/cqrs";

import { knexConnection } from "../../database";
import { TempToken, TempTokenId } from "../models/temp-token/temp-token";
import { TempTokenDataService } from "../models/temp-token/temp-token.ds";
import { UserEmail } from "../models/user-email/user-email";
import { UserEmailDataService } from "../models/user-email/user-email.ds";
import { UserId } from "../models/user/user";
import { makeUserEmailNotMainDBQuery } from "../operations/user-management/make-user-mail-not-main";

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

  // . Make main email not main
  await makeUserEmailNotMainDBQuery(knexConnection, userIdEmailToBeChanged);

  // . Create new email
  const newUserEmail: UserEmail = UserEmail.newMainNotActivated(
    userIdEmailToBeChanged,
    newEmail
  );
  await UserEmailDataService.insert(knexConnection, newUserEmail);

  // . Create new temp token
  const token: TempToken = {
    id: TempTokenId.new(),
    used: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    userEmailId: newUserEmail.id,
  };
  await TempTokenDataService.insert(knexConnection, token);
};
