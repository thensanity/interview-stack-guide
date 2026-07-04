import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { seedIfEmpty } from "./seed.js";
import type { ProductRepository } from "@interview/db";

function mockRepo(initialCount = 0): ProductRepository {
  let count = initialCount;
  const products: unknown[] = [];
  return {
    count: async () => count,
    create: async (input) => {
      count++;
      const p = { id: "1", ...input, tags: [], inStock: true, createdAt: "", updatedAt: "" };
      products.push(p);
      return p as never;
    },
    findAll: async () => products as never,
    findById: async () => null,
    update: async () => null,
    delete: async () => false,
  };
}

describe("seedIfEmpty", () => {
  it("seeds when database is empty", async () => {
    const repo = mockRepo(0);
    const seeded = await seedIfEmpty(repo);
    assert.equal(seeded, 3);
  });

  it("skips when data already exists", async () => {
    const repo = mockRepo(5);
    const seeded = await seedIfEmpty(repo);
    assert.equal(seeded, 0);
  });
});
