import { OkResponse } from "utils/json-schema";

export const ChangeUserByEmailBodySchema = {
  title: "ChangeUserByEmailBody Schema",
  type: "object",
  properties: {
    "new-email": {
      type: "string",
      minLength: 1,
      description: "Email to change",
    },
  },
  additionalProperties: false,
  required: ["new-email"],
} as const;

export const ChangeUserByEmailResponsesSchema = {
  ...OkResponse(),
} as const;
