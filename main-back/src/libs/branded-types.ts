// BRANDED TYPES
import { v4, validate } from "uuid";

export type Email = string & { readonly Email: unique symbol };
export const Email = {
  ofString: (value: string) => {
    if (!value.includes("@")) {
      throw new Error(`Not valid email`);
    }

    return value as Email;
  },
};

export const createEntityStringId = <ID extends string>() => {
  return {
    new: () => {
      return v4() as ID;
    },
    ofString: (value: string) => {
      if (!validate(value)) {
        throw new Error(`Incorrect user id`);
      }

      return value as ID;
    },
  };
};
