import { v4, validate } from "uuid";

import { UserTable } from "../../../libs/@bibus/db-main/introspected-schema";

export type UserId = string & { readonly UserId: unique symbol };
export const UserId = {
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`${value} is not valid UserId`);
    }

    return value as UserId;
  },
  new: () => {
    return v4() as UserId;
  },
};

export type User = UserTable & { id: UserId };

export type UserRole = ("admin" | "user") & {
  readonly UserRole: unique symbol;
};

const ROLE_ADMIN = "admin";
const ROLE_USER = "user";

const availableRoles = [ROLE_ADMIN, ROLE_USER];

export const UserRole = {
  newUser: () => {
    return "user" as UserRole;
  },
  newAdmin: () => {
    return "admin" as UserRole;
  },
  ofString: (value: string) => {
    if (!availableRoles.includes(value)) {
      throw new Error("not valid user role");
    }

    return value as UserRole;
  },
};
