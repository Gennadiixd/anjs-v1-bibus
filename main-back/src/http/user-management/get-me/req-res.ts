import { OkResponse } from "../../../utils/json-schema";

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
  },
  required: ["id", "role"],
  additionalProperties: false,
} as const;

export const GetUserResponseSchema = {
  ...OkResponse(GetUserOkResponseDataSchema),
} as const;
