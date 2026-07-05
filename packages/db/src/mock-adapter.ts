import type {
  Product,
  ProductRepository,
  ProductFilter,
  CreateProductInput,
  UpdateProductInput,
  PaginationOptions,
  PaginatedResult,
} from "./types.js";

/** In-memory repository for tests and contract validation */
export class MockProductRepository implements ProductRepository {
  private products = new Map<string, Product>();

  constructor(seed: Product[] = []) {
    for (const p of seed) this.products.set(p.id, p);
  }

  private applyFilter(items: Product[], filter?: ProductFilter): Product[] {
    return items.filter((p) => {
      if (filter?.category && p.category !== filter.category) return false;
      if (filter?.inStock !== undefined && p.inStock !== filter.inStock) return false;
      if (filter?.minPrice !== undefined && p.price < filter.minPrice) return false;
      if (filter?.maxPrice !== undefined && p.price > filter.maxPrice) return false;
      return true;
    });
  }

  async findAll(filter?: ProductFilter): Promise<Product[]> {
    const items = [...this.products.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return this.applyFilter(items, filter);
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
    return this.products.get(id) ?? null;
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return ids.map((id) => this.products.get(id)).filter((p): p is Product => !!p);
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
    this.products.set(product.id, product);
    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    this.products.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async count(): Promise<number> {
    return this.products.size;
  }
}
