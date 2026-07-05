import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MockProductRepository } from "./mock-adapter.js";
import { DualWriteRepository } from "./dual-write-adapter.js";

describe("repository contract", () => {
  it("paginates products", async () => {
    const repo = new MockProductRepository(
      Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        description: "d",
        price: i + 1,
        category: "c",
        tags: [],
        inStock: true,
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        updatedAt: new Date(2024, 0, i + 1).toISOString(),
      }))
    );
    const page = await repo.findAllPaginated(undefined, { limit: 2, offset: 0 });
    assert.equal(page.items.length, 2);
    assert.equal(page.total, 5);
    assert.equal(page.nextCursor, "2");
  });

  it("dual-writes to secondary repository", async () => {
    const primary = new MockProductRepository();
    const secondary = new MockProductRepository();
    const events: string[] = [];
    const repo = new DualWriteRepository(primary, secondary, (action) => events.push(action));

    await repo.create({
      name: "Widget",
      description: "Test",
      price: 10,
      category: "tools",
    });

    assert.equal(await primary.count(), 1);
    assert.equal(await secondary.count(), 1);
    assert.deepEqual(events, ["create"]);
  });
});
