import type { ProductRepository, CreateProductInput, UpdateProductInput } from "./types.js";

export type DualWriteCallback = (action: "create" | "update" | "delete", payload: Record<string, unknown>) => void;

/** Dual-write wrapper — interview: MongoDB→DynamoDB migration phase 2 */
export class DualWriteRepository implements ProductRepository {
  constructor(
    private primary: ProductRepository,
    private secondary: ProductRepository,
    private onSecondaryWrite?: DualWriteCallback
  ) {}

  findAll = (...args: Parameters<ProductRepository["findAll"]>) => this.primary.findAll(...args);
  findAllPaginated = (...args: Parameters<ProductRepository["findAllPaginated"]>) =>
    this.primary.findAllPaginated(...args);
  findById = (...args: Parameters<ProductRepository["findById"]>) => this.primary.findById(...args);
  findByIds = (...args: Parameters<ProductRepository["findByIds"]>) => this.primary.findByIds(...args);
  count = () => this.primary.count();

  async create(input: CreateProductInput) {
    const product = await this.primary.create(input);
    try {
      await this.secondary.create({
        ...input,
        name: product.name,
      });
      this.onSecondaryWrite?.("create", { productId: product.id, target: "secondary" });
    } catch (err) {
      this.onSecondaryWrite?.("create", { productId: product.id, target: "secondary", error: String(err) });
    }
    return product;
  }

  async update(id: string, input: UpdateProductInput) {
    const product = await this.primary.update(id, input);
    if (product) {
      try {
        await this.secondary.update(id, input);
        this.onSecondaryWrite?.("update", { productId: id, target: "secondary" });
      } catch (err) {
        this.onSecondaryWrite?.("update", { productId: id, target: "secondary", error: String(err) });
      }
    }
    return product;
  }

  async delete(id: string) {
    const deleted = await this.primary.delete(id);
    if (deleted) {
      try {
        await this.secondary.delete(id);
        this.onSecondaryWrite?.("delete", { productId: id, target: "secondary" });
      } catch (err) {
        this.onSecondaryWrite?.("delete", { productId: id, target: "secondary", error: String(err) });
      }
    }
    return deleted;
  }
}
