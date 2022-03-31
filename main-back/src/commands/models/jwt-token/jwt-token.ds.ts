import { Knex } from "knex";

import {
  JwtTokenTable,
  JwtTokenTableName,
} from "../../../utils/introspected-schema";
import { UserId } from "../user/user";

import { JwtToken, JwtTokenId, JwtTokenState } from "./jwt-token";

export const JwtTokenDataMapper = {
  fromModel: (jwtToken: JwtToken): JwtTokenTable => {
    return {
      id: jwtToken.id,
      logoutDate: jwtToken.state.logoutDate,
      banDate: jwtToken.state.banDate,
      createdAt: jwtToken.createdAt,
      updatedAt: jwtToken.updatedAt,
      userId: jwtToken.userId,
    };
  },
  toModel: (jwtTokenTable: JwtTokenTable): JwtToken => {
    const { banDate, logoutDate } = jwtTokenTable;

    let state: JwtTokenState;

    if (banDate && logoutDate) {
      state = {
        __type: "JwtTokenStateBannedAndLoggedOut",
        banDate,
        logoutDate,
      };
    } else if (banDate) {
      state = {
        __type: "JwtTokenStateBanned",
        banDate,
        logoutDate,
      };
    } else if (logoutDate) {
      state = {
        __type: "JwtTokenStateLoggedOut",
        banDate,
        logoutDate,
      };
    } else {
      state = {
        __type: "JwtTokenStateActive",
        banDate,
        logoutDate,
      };
    }

    return {
      id: jwtTokenTable.id as JwtTokenId,
      userId: jwtTokenTable.userId as UserId,
      createdAt: jwtTokenTable.createdAt,
      updatedAt: jwtTokenTable.updatedAt,
      state,
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
