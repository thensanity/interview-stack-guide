import { Router } from "express";
import type { ProductRepository } from "@interview/db";
import type { EventBus } from "@interview/events";
import type { ScenarioSimulator } from "../events/scenario-simulator.js";
import { withDbGuard } from "../middleware/situational.js";

/** REST layer — emits domain events on CRUD for situational event demo */
export function createRestRouter(
  repo: ProductRepository,
  provider: string,
  bus: EventBus,
  simulator: ScenarioSimulator
): Router {
  const router = Router();

  router.get("/products", async (req, res) => {
    try {
      const filter = {
        category: req.query.category as string | undefined,
        inStock: req.query.inStock === "true" ? true : req.query.inStock === "false" ? false : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };
      const products = await withDbGuard(simulator, () => repo.findAll(filter));
      res.json({ data: products, meta: { count: products.length, provider } });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.get("/products/:id", async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => repo.findById(req.params.id));
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.post("/products", async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => repo.create(req.body));
      bus.emitDomain("PRODUCT_CREATED", `Product created: ${product.name}`, { productId: product.id });
      res.status(201).json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.put("/products/:id", async (req, res) => {
    try {
      const product = await withDbGuard(simulator, () => repo.update(req.params.id, req.body));
      if (!product) return res.status(404).json({ error: "Product not found" });
      bus.emitDomain("PRODUCT_UPDATED", `Product updated: ${product.name}`, { productId: product.id });
      res.json({ data: product });
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  router.delete("/products/:id", async (req, res) => {
    try {
      const deleted = await withDbGuard(simulator, () => repo.delete(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Product not found" });
      bus.emitDomain("PRODUCT_DELETED", `Product deleted: ${req.params.id}`, { productId: req.params.id });
      res.status(204).send();
    } catch {
      res.status(503).json({ error: "Database unavailable", scenario: "db_error" });
    }
  });

  return router;
}
