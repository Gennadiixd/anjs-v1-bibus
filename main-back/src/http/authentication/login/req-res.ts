import { OkResponse } from "utils/json-schema";

export const LoginBodySchema = {
  title: "AuthRegisterBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
    tempToken: {
      type: "string",
      minLength: 1,
      description: "Temp token for registration",
    },
  },
  additionalProperties: false,
  required: ["email", "tempToken"],
} as const;

export const LoginOkResponseDataSchema = {
  title: "Success",
  type: "object",
  required: ["token"],
  properties: {
    token: {
      type: "string",
      description: "Token",
    },
  },
  additionalProperties: false,
} as const;

export const LoginResponsesSchema = {
  ...OkResponse(LoginOkResponseDataSchema),
} as const;
