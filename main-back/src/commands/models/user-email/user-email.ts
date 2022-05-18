import { v4, validate } from "uuid";

import { UserEmailTable } from "../../../libs/@bibus/db-main/introspected-schema";
import { Email } from "../../../libs/branded-types";
import { UserId } from "../user/user";

export type UserEmailId = string & { readonly UserEmailId: unique symbol };
export const UserEmailId = {
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`${value} is not valid UserEmailId`);
    }

    return value as UserEmailId;
  },
  new: () => {
    return v4() as UserEmailId;
  },
};

export type UserEmailStateActivated = {
  __type: "UserEmailStateActivated";
  activated: true;
  value: string;
};

export type UserEmailStateInactivated = {
  __type: "UserEmailStateInactivated";
  activated: false;
  value: string;
};

export type UserEmailStateEmpty = {
  __type: "UserEmailStateEmpty";
  activated: false;
  value: null;
};

export type UserEmailState =
  | UserEmailStateActivated
  | UserEmailStateInactivated
  | UserEmailStateEmpty;

export type UserEmail = Omit<UserEmailTable, "activated" | "value"> & {
  userId: UserId;
  id: UserEmailId;
  state: UserEmailState;
};

export const UserEmail = {
  newMainNotActivated: (userId: UserId, newEmail: Email): UserEmail => {
    return {
      main: true,
      id: UserEmailId.new(),
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      state: {
        __type: "UserEmailStateInactivated",
        value: newEmail,
        activated: false,
      },
    };
  },
};
