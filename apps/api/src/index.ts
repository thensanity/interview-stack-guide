import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { EventBus } from "@interview/events";
import { createProductRepository } from "@interview/db";
import { typeDefs, createResolvers, type GraphQLContext } from "@interview/graphql";
import { loadConfig } from "./config.js";
import { createRestRouter } from "./routes/rest.js";
import { createEventsRouter } from "./routes/events.js";
import { ScenarioSimulator } from "./events/scenario-simulator.js";
import { situationalMiddleware } from "./middleware/situational.js";
import { seedIfEmpty } from "./seed.js";

async function main() {
  const config = loadConfig();
  const repo = await createProductRepository(config.db);
  const eventBus = new EventBus();
  const simulator = new ScenarioSimulator(eventBus);

  if (process.env.SEED_DATA === "true") {
    const seeded = await seedIfEmpty(repo);
    if (seeded > 0) {
      console.log(`Seeded ${seeded} sample products`);
      eventBus.emitDomain("PRODUCT_CREATED", `Seeded ${seeded} sample products`);
    }
  }

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(situationalMiddleware(simulator));

  app.use("/api", createRestRouter(repo, config.db.provider, eventBus, simulator));
  app.use("/api", createEventsRouter(eventBus, simulator));

  app.get("/health", (_req, res) => {
    const degraded = simulator.isActive("api_degraded");
    res.status(degraded ? 503 : 200).json({
      status: degraded ? "degraded" : "ok",
      provider: config.db.provider,
      deployTarget: config.deployTarget,
      activeScenarios: simulator.getActive(),
    });
  });

  app.get("/ready", async (_req, res) => {
    try {
      if (simulator.isActive("db_error")) throw new Error("simulated");
      await repo.count();
      res.json({ ready: true, activeScenarios: simulator.getActive() });
    } catch {
      res.status(503).json({ ready: false });
    }
  });

  const apollo = new ApolloServer({
    typeDefs,
    resolvers: createResolvers(() => simulator.consumeDbError()),
  });
  await apollo.start();

  app.use(
    "/graphql",
    expressMiddleware(apollo, {
      context: async (): Promise<GraphQLContext> => ({
        repo,
        dataProvider: config.db.provider,
        events: eventBus,
        getActiveScenarios: () => simulator.getActive(),
        triggerScenario: (id) => simulator.trigger(id),
      }),
    })
  );

  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
    console.log(`  Events:    http://localhost:${config.port}/api/events/stream (SSE)`);
    console.log(`  Scenarios: http://localhost:${config.port}/api/scenarios`);
  });
}

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
