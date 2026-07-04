import { Router } from "express";
import type { EventBus } from "@interview/events";
import type { ScenarioSimulator } from "../events/scenario-simulator.js";

export function createEventsRouter(bus: EventBus, simulator: ScenarioSimulator): Router {
  const router = Router();

  router.get("/events", (_req, res) => {
    res.json({ data: bus.getHistory(50) });
  });

  router.get("/events/stream", (req, res) => {
    const cleanup = simulator.streamSse(res);
    req.on("close", cleanup);
  });

  router.get("/scenarios", (_req, res) => {
    res.json({ data: simulator.list() });
  });

  router.post("/scenarios/:id/trigger", (req, res) => {
    const result = simulator.trigger(req.params.id as Parameters<ScenarioSimulator["trigger"]>[0]);
    if (!result.ok) return res.status(400).json({ error: result.message });
    res.json({ data: result, active: simulator.getActive() });
  });

  return router;
}
