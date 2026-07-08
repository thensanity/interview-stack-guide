import { Router } from "express";
import type { ProductRepository } from "@interview/db";

/** Full-text search demo — production: Elasticsearch/OpenSearch (see docker-compose search profile) */
export function createSearchRouter(getRepo: () => ProductRepository): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const q = String(req.query.q ?? "").toLowerCase().trim();
    if (!q) return res.status(400).json({ error: "Query param 'q' required" });

    const products = await getRepo().findAll();
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    res.json({
      data: results,
      meta: { query: q, total: results.length, engine: "in-memory-demo" },
    });
  });

  return router;
}
