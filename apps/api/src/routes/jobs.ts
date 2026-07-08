import { Router } from "express";
import type { ProductRepository } from "@interview/db";
import { jobQueue } from "../jobs/queue.js";

export function createJobsRouter(getRepo: () => ProductRepository): Router {
  const router = Router();

  router.get("/", (_req, res) => {
    res.json({ data: jobQueue.list() });
  });

  router.post("/index-product", async (req, res) => {
    const productId = req.body?.productId as string;
    if (!productId) return res.status(400).json({ error: "productId required" });
    const product = await getRepo().findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const job = await jobQueue.enqueue("PRODUCT_INDEX", { productId, name: product.name });
    res.status(202).json({ data: job });
  });

  return router;
}
