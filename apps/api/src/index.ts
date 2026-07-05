import { createApp } from "./app.js";

async function main() {
  const { server, deps } = await createApp();
  const { config } = deps;

  server.listen(config.port, () => {
    console.log(JSON.stringify({
      level: "info",
      message: "API started",
      port: config.port,
      provider: config.db.provider,
      cache: !!config.redisUrl,
      auth: config.enableAuth,
    }));
    console.log(`  REST:      http://localhost:${config.port}/api/products`);
    console.log(`  GraphQL:   http://localhost:${config.port}/graphql`);
    console.log(`  SSE:       http://localhost:${config.port}/api/events/stream`);
    console.log(`  WebSocket: ws://localhost:${config.port}/api/events/ws`);
    console.log(`  Metrics:   http://localhost:${config.port}/metrics`);
    console.log(`  OpenAPI:   http://localhost:${config.port}/openapi.yaml`);
    console.log(`  Auth:      POST http://localhost:${config.port}/api/auth/login`);
  });
}

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
