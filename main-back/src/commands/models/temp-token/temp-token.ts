import { v4, validate } from "uuid";

import { TempTokenTable } from "../../../utils/introspected-schema";
import { UserEmailId } from "../user-email/user-email";

export type TempTokenId = string & { readonly TempTokenId: unique symbol };
export const TempTokenId = {
  new: () => {
    return v4() as TempTokenId;
  },
  ofString: (value: string) => {
    if (!validate(value)) {
      throw new Error(`Incorrect user id`);
    }

    return value as TempTokenId;
  },
};

export type TempToken = TempTokenTable & {
  id: TempTokenId;
  userEmailId: UserEmailId;
};
