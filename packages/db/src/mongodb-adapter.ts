import { MongoClient, Db, Collection } from "mongodb";
import type {
  Product,
  ProductRepository,
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
} from "./types.js";

/** MongoDB adapter — document-oriented NoSQL (interview: flexible schema, embedded docs, aggregation pipeline) */
export class MongoProductRepository implements ProductRepository {
  private client: MongoClient;
  private db: Db | null = null;
  private collectionName = "products";

  constructor(private uri: string) {
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db();
    const col = this.collection();
    await col.createIndex({ category: 1 });
    await col.createIndex({ price: 1 });
    await col.createIndex({ name: "text", description: "text" });
  }

  private collection(): Collection<Product> {
    if (!this.db) throw new Error("MongoDB not connected");
    return this.db.collection<Product>(this.collectionName);
  }

  private buildQuery(filter?: ProductFilter): Record<string, unknown> {
    const query: Record<string, unknown> = {};
    if (filter?.category) query.category = filter.category;
    if (filter?.inStock !== undefined) query.inStock = filter.inStock;
    if (filter?.minPrice !== undefined || filter?.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) (query.price as Record<string, number>).$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) (query.price as Record<string, number>).$lte = filter.maxPrice;
    }
    return query;
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    return this.collection().find(this.buildQuery(filter)).sort({ createdAt: -1 }).toArray();
  }

  async findById(id: string): Promise<Product | null> {
    return this.collection().findOne({ id });
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
    await this.collection().insertOne(product);
    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const result = await this.collection().findOneAndUpdate(
      { id },
      { $set: { ...input, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );
    return result ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ id });
    return result.deletedCount === 1;
  }

  async count(): Promise<number> {
    return this.collection().countDocuments();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }
}
