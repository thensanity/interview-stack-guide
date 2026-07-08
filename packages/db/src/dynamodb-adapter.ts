import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  Product,
  ProductRepository,
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
  PaginationOptions,
  PaginatedResult,
} from "./types.js";

/** DynamoDB adapter — key-value / document NoSQL on AWS (interview: single-table design, GSI, eventual consistency) */
export class DynamoProductRepository implements ProductRepository {
  private docClient: DynamoDBDocumentClient;

  constructor(
    private tableName: string,
    config: {
      region: string;
      endpoint?: string;
      accessKeyId?: string;
      secretAccessKey?: string;
    }
  ) {
    const client = new DynamoDBClient({
      region: config.region,
      ...(config.endpoint && {
        endpoint: config.endpoint,
        credentials: {
          accessKeyId: config.accessKeyId ?? "local",
          secretAccessKey: config.secretAccessKey ?? "local",
        },
      }),
    });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  private matchesFilter(product: Product, filter?: ProductFilter): boolean {
    if (!filter) return true;
    if (filter.category && product.category !== filter.category) return false;
    if (filter.inStock !== undefined && product.inStock !== filter.inStock) return false;
    if (filter.minPrice !== undefined && product.price < filter.minPrice) return false;
    if (filter.maxPrice !== undefined && product.price > filter.maxPrice) return false;
    return true;
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    if (filter?.category) {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: "category-index",
          KeyConditionExpression: "category = :cat",
          ExpressionAttributeValues: { ":cat": filter.category },
        })
      );
      const items = (result.Items ?? []) as Product[];
      return items.filter((p) => this.matchesFilter(p, { ...filter, category: undefined })).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const result = await this.docClient.send(new ScanCommand({ TableName: this.tableName }));
    const items = (result.Items ?? []) as Product[];
    return items.filter((p) => this.matchesFilter(p, filter)).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findAllPaginated(
    filter?: ProductFilter,
    options?: PaginationOptions
  ): Promise<PaginatedResult<Product>> {
    const all = await this.findAll(filter);
    const limit = Math.min(options?.limit ?? 20, 100);
    const offset = options?.cursor ? parseInt(options.cursor, 10) : (options?.offset ?? 0);
    const items = all.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    return {
      items,
      total: all.length,
      limit,
      offset,
      nextCursor: nextOffset < all.length ? String(nextOffset) : null,
    };
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.docClient.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );
    return (result.Item as Product) ?? null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const results = await Promise.all(ids.map((id) => this.findById(id)));
    return results.filter((p): p is Product => p !== null);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const now = new Date().toISOString();
    const product: Product = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      tags: input.tags ?? [],
      inStock: input.inStock ?? true,
      createdAt: now,
      updatedAt: now,
    };
    await this.docClient.send(new PutCommand({ TableName: this.tableName, Item: product }));
    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updates = { ...input, updatedAt: new Date().toISOString() };
    const keys = Object.keys(updates);
    const exprNames: Record<string, string> = {};
    const exprValues: Record<string, unknown> = {};
    const setParts: string[] = [];

    keys.forEach((key, i) => {
      exprNames[`#k${i}`] = key;
      exprValues[`:v${i}`] = (updates as Record<string, unknown>)[key];
      setParts.push(`#k${i} = :v${i}`);
    });

    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${setParts.join(", ")}`,
        ExpressionAttributeNames: exprNames,
        ExpressionAttributeValues: exprValues,
        ReturnValues: "ALL_NEW",
      })
    );
    return result.Attributes as Product;
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) return false;
    await this.docClient.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
    return true;
  }

  async count(): Promise<number> {
    const items = await this.findAll();
    return items.length;
  }
}
