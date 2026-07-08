import type { DbConfig, ProductRepository } from "./types.js";
import { MongoProductRepository } from "./mongodb-adapter.js";
import { DynamoProductRepository } from "./dynamodb-adapter.js";
import { PostgresProductRepository } from "./postgres-adapter.js";

/** Factory pattern — interview: explain how env-driven provider selection enables cloud portability */
export async function createProductRepository(config: DbConfig): Promise<ProductRepository> {
  switch (config.provider) {
    case "mongodb": {
      if (!config.mongodbUri) throw new Error("MONGODB_URI required for mongodb provider");
      const repo = new MongoProductRepository(config.mongodbUri);
      await repo.connect();
      return repo;
    }
    case "dynamodb": {
      if (!config.dynamodb) throw new Error("DynamoDB config required for dynamodb provider");
      return new DynamoProductRepository(config.dynamodb.tableName, {
        region: config.dynamodb.region,
        endpoint: config.dynamodb.endpoint,
        accessKeyId: config.dynamodb.accessKeyId,
        secretAccessKey: config.dynamodb.secretAccessKey,
      });
    }
    case "postgres": {
      return PostgresProductRepository.connect(config.postgresUri);
    }
    default:
      throw new Error(`Unknown provider: ${config.provider satisfies never}`);
  }
}

export * from "./types.js";
export { MongoProductRepository } from "./mongodb-adapter.js";
export { DynamoProductRepository } from "./dynamodb-adapter.js";
export { PostgresProductRepository } from "./postgres-adapter.js";
export { MockProductRepository } from "./mock-adapter.js";
export { DualWriteRepository } from "./dual-write-adapter.js";
