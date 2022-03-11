import { OkResponse } from "utils/json-schema";

export const AuthRegisterBodySchema = {
  title: "AuthRegisterBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
  },
  additionalProperties: false,
  required: ["email"],
} as const;

export const AuthRegisterResponsesSchema = {
  ...OkResponse(),
} as const;
