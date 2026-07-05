/** Standalone E2E server — mock DB, no MongoDB required */
import { createApp } from "./app.js";
import { MockProductRepository } from "@interview/db";

const repo = new MockProductRepository([
  {
    id: "e2e-1",
    name: "E2E Widget",
    description: "Test product",
    price: 29.99,
    category: "tools",
    tags: [],
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);

const { server } = await createApp({
  repo,
  config: {
    port: 4000,
    deployTarget: "kubernetes",
    db: { provider: "mongodb" },
    auth: {
      jwtSecret: "e2e-secret",
      demoUsers: [
        {
          email: "admin@interview.local",
          password: "interview123",
          user: { id: "1", email: "admin@interview.local", role: "admin" },
        },
      ],
    },
    rateLimitMax: 10_000,
    enableAuth: false,
  },
});

server.listen(4000, "127.0.0.1", () => {
  console.log("E2E API ready on http://127.0.0.1:4000");
});
