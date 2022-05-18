import pino from "pino";

type LoggerConfig = {
  appVersion: string;
  environment: string;
  appName: string;
};

export let pinoLogger: pino.Logger;

export const initLogger = (config: LoggerConfig) => {
  pinoLogger = pino({
    mixin: () => {
      return {
        appVersion: config.appVersion,
        environment: config.environment,
        appName: config.appName,
      };
    },
  });

  pinoLogger.debug = pinoLogger.debug.bind(pinoLogger);
  pinoLogger.warn = pinoLogger.warn.bind(pinoLogger);
  pinoLogger.error = pinoLogger.error.bind(pinoLogger);

  return pinoLogger;
};
