import express, { type Express } from "express";
import cors from "cors";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import type { Server } from "http";
import { createServer } from "http";
import type { ProductRepository } from "@interview/db";
import { DualWriteRepository, MockProductRepository } from "@interview/db";
import { EventBus } from "@interview/events";
import { typeDefs, createResolvers, createGraphQLContext } from "@interview/graphql";
import type { AppConfig } from "./config.js";
import { loadConfig } from "./config.js";
import { createRestRouter } from "./routes/rest.js";
import { createEventsRouter } from "./routes/events.js";
import { createAuthRouter } from "./routes/auth.js";
import { ScenarioSimulator } from "./events/scenario-simulator.js";
import { situationalMiddleware } from "./middleware/situational.js";
import { createAuthService, authMiddleware, requireMutationAuth } from "./middleware/auth.js";
import { createCacheService, cacheMiddleware } from "./middleware/cache.js";
import { createRateLimiter } from "./middleware/rate-limit.js";
import { loggingMiddleware } from "./middleware/logging.js";
import { createMetrics } from "./middleware/metrics.js";
import { attachEventWebSocket } from "./websocket/event-ws.js";
import { seedIfEmpty } from "./seed.js";
import { createProductRepository } from "@interview/db";

export interface AppDependencies {
  repo: ProductRepository;
  eventBus: EventBus;
  simulator: ScenarioSimulator;
  config: AppConfig;
}

export async function createApp(deps?: Partial<AppDependencies>): Promise<{
  app: Express;
  server: Server;
  deps: AppDependencies;
}> {
  const config = deps?.config ?? loadConfig();
  const eventBus = deps?.eventBus ?? new EventBus();
  const simulator = deps?.simulator ?? new ScenarioSimulator(eventBus);

  let repo = deps?.repo;
  if (!repo) {
    repo = await createProductRepository(config.db);
    if (process.env.SEED_DATA === "true") {
      const seeded = await seedIfEmpty(repo);
      if (seeded > 0) {
        eventBus.emitDomain("PRODUCT_CREATED", `Seeded ${seeded} sample products`);
      }
    }
  }

  const shadowRepo = new MockProductRepository();
  const getRepo = (): ProductRepository => {
    if (simulator.isDualWriteActive()) {
      return new DualWriteRepository(repo!, shadowRepo, (action, payload) => {
        eventBus.emitOperational("MIGRATION_DUAL_WRITE", `Shadow write: ${action}`, payload);
      });
    }
    return repo!;
  };

  const auth = createAuthService(config.auth);
  const cache = await createCacheService(config.redisUrl);
  const metrics = createMetrics();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(loggingMiddleware);
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => metrics.recordRequest(req.method, req.path, res.statusCode, Date.now() - start));
    next();
  });
  app.use(createRateLimiter(config.rateLimitMax));
  app.use(situationalMiddleware(simulator));
  app.use(authMiddleware(auth));
  if (config.enableAuth) {
    app.use("/api/products", requireMutationAuth);
  }
  app.use(cacheMiddleware(cache));

  app.get("/health", (_req, res) => {
    const degraded = simulator.isActive("api_degraded");
    res.status(degraded ? 503 : 200).json({
      status: degraded ? "degraded" : "ok",
      provider: config.db.provider,
      deployTarget: config.deployTarget,
      activeScenarios: simulator.getActive(),
      cache: cache.isEnabled(),
      auth: config.enableAuth,
    });
  });

  app.get("/ready", async (_req, res) => {
    try {
      if (simulator.isActive("db_error")) throw new Error("simulated");
      await getRepo().count();
      res.json({ ready: true, activeScenarios: simulator.getActive() });
    } catch {
      res.status(503).json({ ready: false });
    }
  });

  app.get("/metrics", metrics.metricsHandler);

  app.get("/openapi.yaml", (_req, res) => {
    const dir = dirname(fileURLToPath(import.meta.url));
    const spec = readFileSync(join(dir, "..", "openapi.yaml"), "utf-8");
    res.type("text/yaml").send(spec);
  });

  app.use("/api/auth", createAuthRouter(auth));
  app.use("/api", createRestRouter(getRepo, config.db.provider, eventBus, simulator, cache));
  app.use("/api", createEventsRouter(eventBus, simulator));

  const apollo = new ApolloServer({
    typeDefs,
    resolvers: createResolvers(() => simulator.consumeDbError()),
  });
  await apollo.start();

  app.use(
    "/graphql",
    expressMiddleware(apollo, {
      context: async () =>
        createGraphQLContext(
          getRepo(),
          config.db.provider,
          eventBus,
          () => simulator.getActive(),
          (id) => simulator.trigger(id)
        ),
    })
  );

  const server = createServer(app);
  attachEventWebSocket(server, eventBus);

  return { app, server, deps: { repo: repo!, eventBus, simulator, config } };
}
