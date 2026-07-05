import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createProductSchema, paginationSchema } from "./schemas.js";

describe("validation schemas", () => {
  it("rejects invalid product input", () => {
    const result = createProductSchema.safeParse({ name: "", price: -1 });
    assert.equal(result.success, false);
  });

  it("accepts valid product input", () => {
    const result = createProductSchema.safeParse({
      name: "Widget",
      description: "A widget",
      price: 9.99,
      category: "tools",
    });
    assert.equal(result.success, true);
  });

  it("applies pagination defaults", () => {
    const result = paginationSchema.parse({});
    assert.equal(result.limit, 20);
    assert.equal(result.offset, 0);
  });
});
