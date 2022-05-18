export type OkResponseSchemaWithoutResult = {
  title: string;
  type: "object";
  required: ["status"];
  properties: {
    status: {
      const: "success";
      type: "string";
      description: "Successful operation status";
      example: "success";
    };
  };
  additionalProperties: false;
};

export type OkResponseSchemaWithResult<R extends Record<any, any>> = {
  title: string;
  type: "object";
  required: ["status", "result"];
  properties: {
    status: {
      const: "success";
      type: "string";
      description: "Successful operation status";
      example: "success";
    };
    result: R;
  };
  additionalProperties: false;
};

export function OkResponse(): { "200": OkResponseSchemaWithoutResult };
export function OkResponse<R extends Record<any, any>>(
  result: R
): { "200": OkResponseSchemaWithResult<R> };

export function OkResponse<R>(
  result?: R,
  title: string = "Success"
): { "200": OkResponseSchemaWithResult<R> | OkResponseSchemaWithoutResult } {
  if (result === undefined) {
    return {
      "200": {
        title,
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
    };
  } else {
    return {
      "200": {
        title,
        type: "object",
        required: ["status", "result"],
        properties: {
          status: {
            const: "success",
            type: "string",
            description: "Successful operation status",
            example: "success",
          },
          result,
        },
        additionalProperties: false,
      },
    };
  }
}
