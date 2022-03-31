import { Knex } from "knex";

import { UserEmailKnexTable } from "../../models/user-email/user-email.ds";
import { UserId } from "../../models/user/user";

export const makeUserEmailNotMainDBQuery = async (
  knex: Knex,
  userId: UserId
) => {
  await UserEmailKnexTable(knex)
    .where("userId", userId)
    .andWhere("main", true)
    .update({ main: false });
};
