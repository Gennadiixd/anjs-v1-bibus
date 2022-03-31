import { v4, validate } from "uuid";

import {
  JwtTokenTable,
  JwtTokenTableBanDate,
  JwtTokenTableLogoutDate,
} from "../../../utils/introspected-schema";
import { UserId } from "../user/user";

export type JwtTokenId = string & { readonly JwtTokenId: unique symbol };
export const JwtTokenId = {
  new: () => {
    return v4() as JwtTokenId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect JwtTokenId`);
    }

    return value as JwtTokenId;
  },
};

export type JwtTokenStateBannedAndLoggedOut = {
  __type: "JwtTokenStateBannedAndLoggedOut";
  banDate: Date;
  logoutDate: Date;
};

export type JwtTokenStateBannedAndLoggedIn = {
  __type: "JwtTokenStateBannedAndLoggedIn";
  banDate: JwtTokenTableBanDate;
  logoutDate: null;
};

export type JwtTokenStateBanned = {
  __type: "JwtTokenStateBanned";
  banDate: Date;
  logoutDate: JwtTokenTableLogoutDate;
};

export type JwtTokenStateActive = {
  __type: "JwtTokenStateActive";
  logoutDate: null;
  banDate: null;
};

export type JwtTokenStateLoggedOut = {
  __type: "JwtTokenStateLoggedOut";
  logoutDate: Date;
  banDate: JwtTokenTableBanDate;
};

export type JwtTokenState =
  | JwtTokenStateBannedAndLoggedOut
  | JwtTokenStateBanned
  | JwtTokenStateActive
  | JwtTokenStateLoggedOut
  | JwtTokenStateBannedAndLoggedIn;

export type JwtToken = Omit<JwtTokenTable, "banDate" | "logoutDate"> & {
  id: JwtTokenId;
  userId: UserId;
  state: JwtTokenState;
};

export type JwtTokenLoggedOut = Omit<
  JwtTokenTable,
  "banDate" | "logoutDate"
> & {
  id: JwtTokenId;
  userId: UserId;
  state: JwtTokenStateLoggedOut;
};

export const JwtToken = {
  newLoggedOut: (jwtToken: JwtToken, logoutDate?: Date): JwtTokenLoggedOut => {
    return {
      id: jwtToken.id,
      userId: jwtToken.userId,
      createdAt: jwtToken.createdAt,
      updatedAt: jwtToken.updatedAt,
      state: {
        __type: "JwtTokenStateLoggedOut",
        banDate: jwtToken.state.banDate,
        logoutDate: logoutDate || new Date(),
      },
    };
  },
};
