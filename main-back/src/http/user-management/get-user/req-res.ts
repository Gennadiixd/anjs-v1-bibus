import { OkResponse } from "../../../utils/json-schema";

export const GetUserParamsSchema = {
  title: "GetUserParamsSchema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User ID",
    },
  },
  additionalProperties: false,
  required: ["id"],
} as const;

export const GetUserOkResponseDataSchema = {
  title: "Success",
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "user id",
    },
    role: {
      type: "string",
      description: "user role",
    },
    createdAt: {
      description: "user created at date",
      type: "string",
    },
  },
  required: ["id", "role", "createdAt"],
  additionalProperties: false,
} as const;

export const GetUserResponseSchema = {
  ...OkResponse(GetUserOkResponseDataSchema),
} as const;
