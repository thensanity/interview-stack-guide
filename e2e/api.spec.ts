import { test, expect } from "@playwright/test";

test.describe("API E2E", () => {
  test("health endpoint returns ok", async ({ request }) => {
    const res = await request.get("/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("auth login returns JWT", async ({ request }) => {
    const res = await request.post("/api/auth/login", {
      data: { email: "admin@interview.local", password: "interview123" },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.token).toBeTruthy();
  });

  test("product validation rejects bad input", async ({ request }) => {
    const res = await request.post("/api/products", {
      data: { name: "", price: -5 },
    });
    expect(res.status()).toBe(400);
  });

  test("openapi spec is served", async ({ request }) => {
    const res = await request.get("/openapi.yaml");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("openapi: 3.0.3");
  });

  test("metrics endpoint exposes prometheus data", async ({ request }) => {
    await request.get("/health");
    const res = await request.get("/metrics");
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain("http_requests_total");
  });

  test("cicd_pipeline scenario can be triggered", async ({ request }) => {
    const res = await request.post("/api/scenarios/cicd_pipeline/trigger");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.data.ok).toBe(true);
  });
});
