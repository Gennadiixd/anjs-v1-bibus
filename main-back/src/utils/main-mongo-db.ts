// Manual DB introspection example
export const UserCollectionName = "users";

export type UserCollection = {
  id: string;
  role: "admin" | "user";
  createdAt?: Date;
};
