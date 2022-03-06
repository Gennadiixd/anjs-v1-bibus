import { OkResponse } from "utils/json-schema";

export const ChangeUserRoleBodySchema = {
  title: "ChangeUserRoleBody Schema",
  type: "object",
  properties: {
    "new-role": {
      type: "string",
      minLength: 1,
      description: "Role to change",
    },
  },
  additionalProperties: false,
  required: ["new-role"],
} as const;

export const ChangeUserRoleResponsesSchema = {
  ...OkResponse(),
} as const;
