import { pinoLogger } from "libs/@bibus/logger";

import { ReactiveCounter } from "../../libs/reactive-counter";

export const gracefulShutdownC =
  (
    db: { destroy: () => Promise<void> },
    counter: ReactiveCounter,
    timeoutInSeconds: number = 30
  ) =>
  async (signal: string, err?: any) => {
    // . Setup logger
    const logger = pinoLogger.child({
      shuttingDown: true,
      signal,
      timeoutInSeconds,
    });

    try {
      // . Add death timer
      setTimeout(() => {
        logger.error("terminate process after timeoutInSeconds");
        process.exit(1);
      }, timeoutInSeconds * 1000).unref(); // https://httptoolkit.tech/blog/unblocking-node-with-unref/#timeoutunref

      // . Log application shutting down
      let logStr = `Application is shutting down`;

      if (err) {
        logStr += ` because of error: ${JSON.stringify(
          err,
          Object.getOwnPropertyNames(err)
        )}`;
      }

      logger.warn(logStr);

      // . Counter
      if (counter.value() > 0) {
        logger.info(
          `There are some something in process, so need to wait. Process number: ${counter.value()}`
        );
        // . Wait until all transactions will be processed
        await counter.waitUntil(0);
      }

      // . Kill DB connection
      await db.destroy();

      // . Log
      logger.info("Bye bye!");

      // . Exit
      if (err) {
        process.exit(1);
      }

      process.exit(0);
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  };
