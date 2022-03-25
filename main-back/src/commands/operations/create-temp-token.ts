import { TempToken } from "commands/models/temp-token";
import { v4 } from "uuid";

import { UserEmail } from "../models/user-email";

export const createTempToken = (userEmail: UserEmail) => {
  // . Create new temp token
  const token = new TempToken();
  token.id = v4();
  token.used = false;
  token.userEmail = userEmail;
  token.createdAt = new Date();

  return token;
};
