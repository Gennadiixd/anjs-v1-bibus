import { CommandOrQuery, CommandQueryHandler } from "libs/cqrs";
import pino from "pino";

export const loggerAspect =
  (logger: pino.Logger) =>
  <Type extends string, Data extends Record<string, any>, R>(
    cqHandler: CommandQueryHandler<CommandOrQuery<Type, Data, R>>
  ) =>
  async (cq: CommandOrQuery<Type, Data, R>): Promise<R> => {
    logger.info(`New request ${cq.meta.transactionId}`);

    try {
      const result = await cqHandler(cq);
      logger.info(`Request ${cq.meta.transactionId} success`);

      return result;
    } catch (e) {
      logger.info(`Request ${cq.meta.transactionId} failure ${e}`);
      throw e;
    }
  };

export const isAuthenticatedAspect =
  <Type extends string, Data extends Record<string, any>, R>(
    cqHandler: CommandQueryHandler<CommandOrQuery<Type, Data, R>>
  ) =>
  async (cq: CommandOrQuery<Type, Data, R>): Promise<R> => {
    if (!cq.meta.userId) {
      throw new Error(`You must be authorized`);
    }

    return cqHandler(cq);
  };

export const debugAspect = loggerAspect;

export const debugAndIsAuthNAspect =
  (logger: pino.Logger) =>
  <Type extends string, Data extends Record<string, any>, R>(
    cqHandler: CommandQueryHandler<CommandOrQuery<Type, Data, R>>
  ) =>
    debugAspect(logger)(isAuthenticatedAspect(cqHandler));
