import { Router } from "express";
import type { ProductRepository } from "@interview/db";
import type { EventBus } from "@interview/events";
import type { ScenarioSimulator } from "../events/scenario-simulator.js";
import { withDbGuard } from "../middleware/situational.js";
import {
  createProductSchema,
  updateProductSchema,
  productFilterSchema,
  paginationSchema,
} from "@interview/validation";
import { validateBody, validateQuery } from "../middleware/validation.js";
import type { CacheService } from "../middleware/cache.js";
import { invalidateProductCache } from "../middleware/cache.js";
import { requireAdmin } from "../middleware/rbac.js";
import { appendOutbox } from "../outbox/outbox.js";
import { jobQueue } from "../jobs/queue.js";

type ValidatedQuery = {
  category?: string;
  inStock?: "true" | "false";
  minPrice?: number;
  maxPrice?: number;
  limit: number;
  offset: number;
  cursor?: string;
};

/** REST layer — emits domain events on CRUD for situational event demo */
export function createRestRouter(
  getRepo: () => ProductRepository,
  provider: string,
  bus: EventBus,
  simulator: ScenarioSimulator,
  cache?: CacheService
): Router {
  const router = Router();
  const invalidate = cache ? invalidateProductCache(cache) : (_req: unknown, _res: unknown, next: () => void) => next();

  router.get(
    "/products",
    validateQuery(productFilterSchema.merge(paginationSchema)),
    async (req, res) => {
      try {
        const q = (req as typeof req & { validatedQuery: ValidatedQuery }).validatedQuery;
        const filter = {
          category: q.category,
          inStock: q.inStock === "true" ? true : q.inStock === "false" ? false : undefined,
          minPrice: q.minPrice,
          maxPrice: q.maxPrice,
        };
        const result = await withDbGuard(simulator, () =>
          getRepo().findAllPaginated(filter, { limit: q.limit, offset: q.offset, cursor: q.cursor })
        );
        res.json({
          data: result.items,
          meta: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            nextCursor: result.nextCursor,
            provider,
          },
        });
      } catch {
        res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
      }
    }
  );

  router.get("/products/:id", async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => getRepo().findById(req.params.id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.post("/products", validateBody(createProductSchema), invalidate, async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => getRepo().create(req.body));
      bus.emitDomain("PRODUCT_CREATED", `Product created: ${product.name}`, { productId: product.id });
      appendOutbox("Product", product.id, "PRODUCT_CREATED", { productId: product.id, name: product.name });
      void jobQueue.enqueue("PRODUCT_INDEX", { productId: product.id, name: product.name });
      res.status(201).json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.put("/products/:id", validateBody(updateProductSchema), invalidate, async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => getRepo().update(req.params.id, req.body));
      if (!product) return res.status(404).json({ error: "Product not found" });
      bus.emitDomain("PRODUCT_UPDATED", `Product updated: ${product.name}`, { productId: product.id });
      res.json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.delete("/products/:id", requireAdmin, invalidate, async (req, res) => {
    try {
      const deleted = await withDbGuard(simulator, () => getRepo().delete(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Product not found" });
      bus.emitDomain("PRODUCT_DELETED", `Product deleted: ${req.params.id}`, { productId: req.params.id });
      res.status(204).send();
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  return router;
}
