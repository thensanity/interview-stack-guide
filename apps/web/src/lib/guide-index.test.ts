import { describe, it, expect } from "vitest";
import { searchGuide, GUIDE_INDEX } from "@/lib/guide-index";

describe("searchGuide", () => {
  it("returns all entries for empty query", () => {
    expect(searchGuide("").length).toBe(GUIDE_INDEX.length);
  });

  it("filters by tag", () => {
    const results = searchGuide("kubernetes");
    expect(results.some((r) => r.id === "k8s")).toBe(true);
  });

  it("filters by title", () => {
    const results = searchGuide("graphql");
    expect(results.some((r) => r.id === "graphql")).toBe(true);
  });
});
