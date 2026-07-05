import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  webServer: {
    command: "npx tsx apps/api/src/e2e-server.ts",
    url: "http://127.0.0.1:4000/health",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4000",
  },
});
