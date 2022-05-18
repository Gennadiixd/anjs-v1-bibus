import dotenv from "dotenv";

import { Env } from "../../libs/env";

dotenv.config();

export type ConfigEnv = "development" | "production" | "test";
export const ConfigEnv = {
  ofString: (value: string): ConfigEnv => {
    if (value !== "development" && value !== "production" && value !== "test") {
      throw new Error(`Environment can't be ${value}`);
    }

    return value;
  },
};

export type Config = {
  db: {
    connectionString: string;
  };
  environment: ConfigEnv;
  appVersion: string;
  appName: string;
  querier: {
    http: {
      port: number;
    };
  };
  logger: {
    active: boolean;
  };
  jwtToken: {
    secret: string;
  };
};

// ENV const
const getEnvOrThrowLogs = Env.getEnvOrThrow(console.error);

// . CONFIG
export const config: Config = {
  db: {
    connectionString: getEnvOrThrowLogs("MAIN_DB_CONNECTION_STRING"),
  },
  appVersion: getEnvOrThrowLogs("APP_VERSION"),
  appName: "bibus",
  environment: ConfigEnv.ofString(getEnvOrThrowLogs("NODE_ENV")),
  querier: {
    http: {
      port: +getEnvOrThrowLogs("QUERIER_PORT"),
    },
  },
  logger: {
    active: true,
  },
  jwtToken: {
    secret: getEnvOrThrowLogs("JWT_TOKEN_SECRET"),
  },
};
