const isEmail = (value: string) => value.includes("@");

export type Email = string & { readonly Email: unique symbol };
export const Email = {
  ofString: (value: string) => {
    if (!isEmail(value)) {
      throw new Error(`${value} not valid email`);
    }

    return value as Email;
  },
};
