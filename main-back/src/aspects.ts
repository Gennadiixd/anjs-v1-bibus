import { logger } from "logger";
import { CommandOrQuery, CommandQueryHandler } from "utils/cqrs";

export const loggerAspect =
  <Type extends string, Data extends Record<string, any>, R>(
    cqHandler: CommandQueryHandler<CommandOrQuery<Type, Data, R>>
  ) =>
  async (cq: CommandOrQuery<Type, Data, R>): Promise<R> => {
    logger.info(`New request ${cq.meta.traceId}`);

    try {
      const result = await cqHandler(cq);
      logger.info(`Request ${cq.meta.traceId} success`);

      return result;
    } catch (e) {
      logger.info(`Request ${cq.meta.traceId} failure ${e}`);
      throw e;
    }
  };
