import { v4, validate } from "uuid";

import { JwtTokenTable } from "../../../utils/introspected-schema";
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

export type JwtToken = JwtTokenTable & {
  id: JwtTokenId;
  userId: UserId;
};
