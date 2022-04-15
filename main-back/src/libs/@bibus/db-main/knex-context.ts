import { AsyncLocalStorage } from "async_hooks";

import { Knex } from "knex";

export const asyncDbLocalStorage = new AsyncLocalStorage<{
  knexConnection: Knex;
}>();

export function getDbContext() {
  const context = asyncDbLocalStorage.getStore();

  if (!context || !("knexConnection" in context)) {
    throw new Error("knexConnection Context not provided");
  }

  return context;
}
