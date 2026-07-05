import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RestClient } from "@/components/playground/RestClient";

describe("RestClient", () => {
  beforeEach(() => {
    const headers = new Headers({ "x-cache": "MISS", "x-request-id": "abc-123" });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => JSON.stringify({ data: [] }),
      headers,
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders send button and presets", () => {
    render(<RestClient />);
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Health")).toBeInTheDocument();
    expect(screen.getByText("List Products")).toBeInTheDocument();
  });

  it("applies health preset", () => {
    render(<RestClient />);
    fireEvent.click(screen.getByText("Health"));
    const input = screen.getByPlaceholderText("/api/products") as HTMLInputElement;
    expect(input.value).toBe("/health");
  });
});
