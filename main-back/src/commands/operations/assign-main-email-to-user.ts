import { TempToken } from "commands/models/temp-token";
import { User } from "commands/models/user";
import { UserEmail } from "commands/models/user-email";
import { Email } from "utils/branded-types";
import { v4 } from "uuid";

export const assignMainEmailToUser = async (
  user: User,
  emailValue: Email,
  isActivated: boolean = false
) => {
  // . Create new user email
  const newUserEmail = new UserEmail();
  newUserEmail.id = v4();
  newUserEmail.main = true;
  newUserEmail.activated = isActivated;
  newUserEmail.user = user;
  newUserEmail.value = emailValue;

  // . Create new temp token
  const token = new TempToken();
  token.id = v4();
  token.used = false;
  token.userEmail = newUserEmail;
  token.createdAt = new Date();

  // . Add new temp token email
  (await newUserEmail.tempTokens).push(token);

  // . Add new email to user
  user.emails.push(newUserEmail);
};
