import { Router } from "express";
import type { EventBus } from "@interview/events";
import { getPendingOutbox, relayOutbox } from "../outbox/outbox.js";

export function createOutboxRouter(bus: EventBus): Router {
  const router = Router();

  router.get("/pending", (_req, res) => {
    res.json({ data: getPendingOutbox() });
  });

  router.post("/relay", (_req, res) => {
    const count = relayOutbox((msg) => {
      const type = msg.eventType as "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED";
      bus.emitDomain(type, `Outbox relay: ${msg.eventType}`, msg.payload);
    });
    res.json({ data: { relayed: count } });
  });

  return router;
}
