import { FastifyRequest } from "fastify";
import { SuccessResponseWR, SuccessResponse } from "utils/responses";

import {
  JwtToken,
  JwtTokenId,
} from "../../../commands/models/jwt-token/jwt-token";
import { JwtTokenDataService } from "../../../commands/models/jwt-token/jwt-token.ds";
import { UserId } from "../../../commands/models/user/user";
import { UserDataService } from "../../../commands/models/user/user.ds";
import { knexConnection } from "../../../database";

export const logout = async (
  request: FastifyRequest
): Promise<SuccessResponseWR> => {
  // . Check auth
  if (!request.userId) {
    throw new Error(`Permission denied`);
  }

  // . Get User
  const user = await UserDataService.findById(
    knexConnection,
    UserId.ofString(request.userId)
  );

  if (!user) {
    throw new Error(`User must be`);
  }

  // find jwt token
  const jwtToken = await JwtTokenDataService.findById(
    knexConnection,
    JwtTokenId.ofString(request.userId)
  );

  if (!jwtToken) {
    throw new Error(`jwtToken must be`);
  }

  // assign logout date
  JwtTokenDataService.insert(knexConnection, JwtToken.newLoggedOut(jwtToken));

  return SuccessResponse.create(request.id);
};
