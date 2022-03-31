import { Knex } from "knex";

import {
  JwtTokenTable,
  JwtTokenTableName,
} from "../../../utils/introspected-schema";
import { UserId } from "../user/user";

import { JwtToken, JwtTokenId } from "./jwt-token";

export const JwtTokenDataMapper = {
  fromModel: (jwtToken: JwtToken): JwtTokenTable => {
    return jwtToken;
  },
  toModel: (jwtTokenTable: JwtTokenTable): JwtToken => {
    return {
      ...jwtTokenTable,
      id: jwtTokenTable.id as JwtTokenId,
      userId: jwtTokenTable.userId as UserId,
    };
  },
};

export const JwtTokenKnexTable = (knex: Knex) =>
  knex<JwtTokenTable>(JwtTokenTableName);

export const findById = async (
  knex: Knex,
  id: JwtTokenId
): Promise<JwtToken | undefined> => {
  const jwtTokenTable = await JwtTokenKnexTable(knex).where({ id }).first();

  return jwtTokenTable ? JwtTokenDataMapper.toModel(jwtTokenTable) : undefined;
};

export const update = async (knex: Knex, jwtToken: JwtToken): Promise<void> => {
  await JwtTokenKnexTable(knex)
    .where({ id: jwtToken.id })
    .update(JwtTokenDataMapper.fromModel(jwtToken));
};

export const insert = async (knex: Knex, jwtToken: JwtToken): Promise<void> => {
  await JwtTokenKnexTable(knex).insert(JwtTokenDataMapper.fromModel(jwtToken));
};

export const JwtTokenDataService = {
  findById,
  update,
  insert,
};
