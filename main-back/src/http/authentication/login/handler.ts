import { TempToken } from "commands/models/temp-token";
import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { JWTToken } from "utils/jwt-tokens";
import { SuccessResponse, SuccessResponseR } from "utils/responses";

import { LoginBodySchema } from "./req-res";

export const login =
  (privateKey: string) =>
  async (
    request: FastifyRequest<{ Body: FromSchema<typeof LoginBodySchema> }>
  ): Promise<SuccessResponseR<{ token: string }>> => {
    // . Get temp token with user
    const tempToken = await TempToken.findOne({
      where: {
        id: request.body.tempToken,
        used: false,
        userEmail: {
          value: request.body.email,
          main: true,
        },
      },
      relations: ["userEmail", "userEmail.user"],
    });

    if (!tempToken) {
      throw new Error(
        `There is no unused token with id ${request.body.tempToken}`
      );
    }

    // . Login
    const user = tempToken.userEmail.user;
    await user.loginByTempToken(tempToken);
    await user.save();

    // . Create JWT for User
    const jwtToken = user.lastJwtToken();

    if (!jwtToken) {
      throw new Error(`No JWT Token`);
    }

    // . Send JWT
    return SuccessResponse.create(request.id, {
      token: JWTToken.sign(privateKey, {
        id: jwtToken.id,
        userId: user.id,
        userEmail: user.mainEmail().value,
      }),
    });
  };
