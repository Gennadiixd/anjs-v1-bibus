import { OkResponse } from "../../../../../libs/@bibus/json-schema";

export const ChangeUserRoleBodySchema = {
  title: "ChangeUserRoleBody Schema",
  type: "object",
  properties: {
    "new-role": {
      type: "string",
      minLength: 1,
      description: "Role to change",
    },
    userIdRoleToBeChanged: {
      type: "string",
      minLength: 1,
      description: "User Id Role To Be Changed",
    },
  },
  additionalProperties: false,
  required: ["new-role", "userIdRoleToBeChanged"],
} as const;

export const ChangeUserRoleResponsesSchema = {
  ...OkResponse(),
} as const;
