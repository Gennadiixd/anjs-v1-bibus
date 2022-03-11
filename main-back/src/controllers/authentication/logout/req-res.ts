export const LogoutResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["status"],
    properties: {
      status: {
        const: "success",
        type: "string",
        description: "Successful operation status",
        example: "success",
      },
    },
    additionalProperties: false,
  },
} as const;
