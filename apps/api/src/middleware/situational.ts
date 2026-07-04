import type { Request, Response, NextFunction } from "express";
import type { ScenarioSimulator } from "../events/scenario-simulator.js";

/** Situational middleware — enforces active scenario behavior on requests */
export function situationalMiddleware(simulator: ScenarioSimulator) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api/scenarios") || req.path === "/api/events/stream") {
      return next();
    }

    if (simulator.isActive("rate_limit") && req.path.startsWith("/api/")) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit scenario active — retry after scenario expires",
        retryAfter: 20,
      });
    }

    if (
      simulator.isActive("auth_required") &&
      req.method !== "GET" &&
      (req.path.startsWith("/api/products") || req.path === "/graphql")
    ) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Auth required scenario active — mutations blocked",
      });
    }

    await simulator.applyLatency();
    next();
  };
}

/** Wrap repository calls to handle db_error scenario */
export function withDbGuard<T>(simulator: ScenarioSimulator, fn: () => Promise<T>): Promise<T> {
  if (simulator.consumeDbError()) {
    return Promise.reject(new Error("Simulated database failure"));
  }
  return fn();
}
