import type { DbConfig, DataProvider } from "@interview/db";

export interface AppConfig {
  port: number;
  deployTarget: "aws" | "kubernetes";
  db: DbConfig;
}

export function loadConfig(): AppConfig {
  const provider = (process.env.DATA_PROVIDER ?? "mongodb") as DataProvider;

  return {
    port: parseInt(process.env.API_PORT ?? "4000", 10),
    deployTarget: (process.env.DEPLOY_TARGET ?? "kubernetes") as "aws" | "kubernetes",
    db: {
      provider,
      mongodbUri: process.env.MONGODB_URI,
      dynamodb: {
        tableName: process.env.DYNAMODB_TABLE ?? "Products",
        region: process.env.AWS_REGION ?? "us-east-1",
        endpoint: process.env.DYNAMODB_ENDPOINT,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    },
  };
}
