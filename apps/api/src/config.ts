import type { DbConfig, DataProvider } from "@interview/db";
import type { AuthConfig } from "./middleware/auth.js";

export interface AppConfig {
  port: number;
  deployTarget: "aws" | "kubernetes";
  db: DbConfig;
  auth: AuthConfig;
  redisUrl?: string;
  rateLimitMax: number;
  enableAuth: boolean;
}

export function loadConfig(): AppConfig {
  const provider = (process.env.DATA_PROVIDER ?? "mongodb") as DataProvider;

  return {
    port: parseInt(process.env.API_PORT ?? "4000", 10),
    deployTarget: (process.env.DEPLOY_TARGET ?? "kubernetes") as "aws" | "kubernetes",
    db: {
      provider,
      mongodbUri: process.env.MONGODB_URI,
      postgresUri: process.env.POSTGRES_URI ?? process.env.DATABASE_URL,
      dynamodb: {
        tableName: process.env.DYNAMODB_TABLE ?? "Products",
        region: process.env.AWS_REGION ?? "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET ?? "interview-dev-secret-change-in-production",
      demoUsers: [
        {
          email: "admin@interview.local",
          password: "interview123",
          user: { id: "1", email: "admin@interview.local", role: "admin" as const },
        },
        {
          email: "viewer@interview.local",
          password: "viewer123",
          user: { id: "2", email: "viewer@interview.local", role: "viewer" as const },
        },
      ],
    },
    redisUrl: process.env.REDIS_URL,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? "100", 10),
    enableAuth: process.env.ENABLE_AUTH === "true",
  };
}
