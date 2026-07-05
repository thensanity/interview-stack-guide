import DataLoader from "dataloader";
import type { Product, ProductRepository } from "@interview/db";

/** DataLoader batches findById calls — interview: solves GraphQL N+1 problem */
export function createProductLoader(repo: ProductRepository) {
  return new DataLoader<string, Product | null>(async (ids) => {
    const products = await repo.findByIds([...ids]);
    const map = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => map.get(id) ?? null);
  });
}
