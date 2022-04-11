import { FastifyRequest } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { SuccessResponse, SuccessResponseR } from "utils/responses";

import { TempTokenId } from "../../../commands/models/temp-token/temp-token";
import { TempTokenKnexTable } from "../../../commands/models/temp-token/temp-token.ds";
import { UserEmailId } from "../../../commands/models/user-email/user-email";
import { UserId } from "../../../commands/models/user/user";
import { UserDataService } from "../../../commands/models/user/user.ds";
import { knexConnection } from "../../../database";

import { LoginBodySchema } from "./req-res";

// Not ready handler just plug
export const login =
  (privateKey: string) =>
  async (
    request: FastifyRequest<{ Body: FromSchema<typeof LoginBodySchema> }>
  ): Promise<SuccessResponseR<{ token: string }>> => {
    // . Get temp token with user

    const tempToken = await TempTokenKnexTable(knexConnection)
      .where("id", TempTokenId.ofString(request.body.tempToken))
      .andWhere("userEmailId", UserEmailId.ofString(request.body.email))
      .first();

    if (!tempToken) {
      throw new Error(
        `There is no unused token with id ${request.body.tempToken}`
      );
    }

    // . Login
    // const user = tempToken.userEmail.user;
    // await user.loginByTempToken(tempToken);
    // await user.save();

    if (!tempToken.userEmailId) {
      throw new Error(`No userEmailId in tempToken`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = UserDataService.findById(
      knexConnection,
      UserId.ofString(tempToken.userEmailId)
    );

    if (tempToken.used) {
      throw new Error(`Already used`);
    }

    // if (tempToken.isExpired()) {
    //   throw new Error("Token is expired");
    // }

    // . Activate email if it hasn't been

    // . Create new JWT token
    // this.jwtTokens.push(JwtToken.createNew(this));

    // . Make temp token used
    // token.use();
    // await token.save();

    // . Create JWT for User
    // const jwtToken = user.lastJwtToken();

    // if (!jwtToken) {
    //   throw new Error(`No JWT Token`);
    // }

    // const createdJwt = {
    //   id: JwtTokenId.new(),
    //   logoutDate: null,
    //   banDate: null,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   userId: "" as UserId,
    // };

    // JwtTokenDataService.insert(knexConnection, createdJwt);

    // . Send JWT
    // return SuccessResponse.create(request.id, {
    //   token: JWTToken.sign(privateKey, {
    //     id: createdJwt.id,
    //     userId: createdJwt.userId,
    //     userEmail: "",
    //   }),
    // });

    return SuccessResponse.create(request.id, {} as any);
  };
