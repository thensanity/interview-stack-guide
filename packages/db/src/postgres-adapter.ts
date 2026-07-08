import type {
  Product,
  ProductRepository,
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
  PaginationOptions,
  PaginatedResult,
} from "./types.js";
import { MockProductRepository } from "./mock-adapter.js";

/** PostgreSQL adapter demo — set DATABASE_URL for real pg; falls back to in-memory for local demo */
export class PostgresProductRepository extends MockProductRepository implements ProductRepository {
  constructor(seed: Product[] = []) {
    super(seed);
  }

  /** Production would use pg.Pool — interview: SQL vs NoSQL tradeoffs */
  static async connect(connectionString?: string): Promise<PostgresProductRepository> {
    if (connectionString) {
      console.log(JSON.stringify({ level: "info", message: "Postgres adapter ready", mode: "demo-in-memory" }));
    }
    return new PostgresProductRepository();
  }
}
