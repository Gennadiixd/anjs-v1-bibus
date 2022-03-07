import { User, UserRole } from "../../../models/user";

export type UserSerialized = {
  id: string;
  role: UserRole;
  createdAt: string;
};

export const serializeUser = (user: User): UserSerialized => {
  return {
    id: user.id,
    role: user.role,
    createdAt: user.createdAt?.toLocaleString("ru"),
  };
};
