import { Email } from "utils/branded-types";
import { v4 } from "uuid";

import { User } from "../models/user";
import { UserEmail } from "../models/user-email";

export const createUserEmail = (user: User, emailValue: Email) => {
  const newUserEmail = new UserEmail();
  newUserEmail.id = v4();
  newUserEmail.main = true;
  newUserEmail.activated = false;
  newUserEmail.user = user;
  newUserEmail.value = emailValue;

  return newUserEmail;
};
