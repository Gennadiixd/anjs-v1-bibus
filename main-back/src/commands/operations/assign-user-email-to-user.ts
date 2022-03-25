import { TempToken } from "commands/models/temp-token";

import { User } from "../models/user";
import { UserEmail } from "../models/user-email";

export const assignUserEmailToUser = async (
  user: User,
  token: TempToken,
  newUserEmail: UserEmail
) => {
  // . Add new temp token email
  (await newUserEmail.tempTokens).push(token);

  // . Add new email to user
  user.emails.push(newUserEmail);
};
