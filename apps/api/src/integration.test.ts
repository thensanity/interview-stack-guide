import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "./app.js";
import { MockProductRepository } from "@interview/db";
import type { Server } from "http";

describe("API integration", () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const repo = new MockProductRepository([
      {
        id: "p1",
        name: "Test Widget",
        description: "A test product",
        price: 19.99,
        category: "tools",
        tags: ["test"],
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
    const { server: s } = await createApp({
      repo,
      config: {
        port: 0,
        deployTarget: "kubernetes",
        db: { provider: "mongodb" },
        auth: {
          jwtSecret: "test-secret",
          demoUsers: [
            {
              email: "admin@interview.local",
              password: "interview123",
              user: { id: "1", email: "admin@interview.local", role: "admin" },
            },
          ],
        },
        rateLimitMax: 1000,
        enableAuth: false,
      },
    });
    server = s;
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : 4000;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(() => {
    server.close();
  });

  it("returns health status", async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, "ok");
  });

  it("lists products with pagination meta", async () => {
    const res = await fetch(`${baseUrl}/api/products?limit=10`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.meta.total, 1);
  });

  it("validates product creation input", async () => {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "", price: -1 }),
    });
    assert.equal(res.status, 400);
  });

  it("issues JWT on login", async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@interview.local", password: "interview123" }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.data.token);
  });

  it("serves OpenAPI spec", async () => {
    const res = await fetch(`${baseUrl}/openapi.yaml`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("openapi: 3.0.3"));
  });

  it("exposes prometheus metrics", async () => {
    await fetch(`${baseUrl}/health`);
    const res = await fetch(`${baseUrl}/metrics`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("http_requests_total"));
  });
});
