/** Demo API — in-memory mock DB, no MongoDB/Docker required */
import { createApp } from "./app.js";
import { MockProductRepository } from "@interview/db";
import { loadConfig } from "./config.js";

const now = new Date().toISOString();
const seed = [
  { id: "demo-1", name: "Mechanical Keyboard", description: "Cherry MX switches, RGB backlight", price: 129.99, category: "electronics", tags: ["peripherals"], inStock: true, createdAt: now, updatedAt: now },
  { id: "demo-2", name: "System Design Whiteboard", description: "4x3 ft magnetic whiteboard for architecture diagrams", price: 89.0, category: "office", tags: ["interview-prep"], inStock: true, createdAt: now, updatedAt: now },
  { id: "demo-3", name: "Cloud Native Handbook", description: "Covers Kubernetes, AWS, and CI/CD patterns", price: 49.99, category: "books", tags: ["kubernetes"], inStock: true, createdAt: now, updatedAt: now },
  { id: "demo-4", name: "USB-C Hub", description: "7-in-1 adapter with HDMI and ethernet", price: 59.99, category: "electronics", tags: ["accessories"], inStock: true, createdAt: now, updatedAt: now },
  { id: "demo-5", name: "Standing Desk Mat", description: "Anti-fatigue mat for standing desks", price: 39.99, category: "office", tags: ["ergonomics"], inStock: false, createdAt: now, updatedAt: now },
  { id: "demo-6", name: "Algorithms Flash Cards", description: "Big-O, trees, graphs — interview prep", price: 24.99, category: "books", tags: ["interview-prep"], inStock: true, createdAt: now, updatedAt: now },
  { id: "demo-7", name: "Noise Cancelling Headphones", description: "Focus mode for deep work sessions", price: 199.99, category: "electronics", tags: ["audio"], inStock: true, createdAt: now, updatedAt: now },
];

const config = loadConfig();
const repo = new MockProductRepository(seed);

const { server } = await createApp({
  repo,
  config: { ...config, redisUrl: undefined },
});

server.listen(config.port, "0.0.0.0", () => {
  console.log(`Demo API ready on http://localhost:${config.port} (mock DB, ${seed.length} products)`);
});
