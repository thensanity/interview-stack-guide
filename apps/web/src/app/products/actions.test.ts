import { describe, it, expect, vi } from "vitest";
import { createProductAction } from "./actions";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: () => ({ value: "test-jwt" }),
    })
  ),
}));

vi.mock("@/lib/api", () => ({
  createProductViaApi: vi.fn().mockResolvedValue({ id: "1", name: "Test" }),
}));

describe("createProductAction", () => {
  it("returns success message on valid create", async () => {
    const formData = new FormData();
    formData.set("name", "Keyboard");
    formData.set("description", "Mechanical");
    formData.set("price", "99");
    formData.set("category", "electronics");

    const result = await createProductAction(null, formData);
    expect(result.ok).toBe(true);
    expect(result.message).toContain("revalidatePath");
  });
});
