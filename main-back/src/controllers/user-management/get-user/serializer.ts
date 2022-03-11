import { UserTableRole } from "utils/introspected-schema";

import { UserFromQuery } from ".";

export type UserSerialized = {
  id: string;
  role: UserTableRole;
  createdAt: string;
};

export const serializeUser = (user: UserFromQuery): UserSerialized => {
  return {
    id: user.id,
    role: user.role,
    createdAt: user.createdAt?.toISOString(),
  };
};
