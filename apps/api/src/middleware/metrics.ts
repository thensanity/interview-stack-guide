import { Registry, Counter, Histogram, collectDefaultMetrics } from "prom-client";
import type { Request, Response } from "express";

/** Prometheus metrics — interview: RED method (Rate, Errors, Duration) */
export function createMetrics() {
  const registry = new Registry();
  collectDefaultMetrics({ register: registry });

  const httpRequestsTotal = new Counter({
    name: "http_requests_total",
    help: "Total HTTP requests",
    labelNames: ["method", "path", "status"],
    registers: [registry],
  });

  const httpRequestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "path"],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    registers: [registry],
  });

  return {
    registry,
    recordRequest(method: string, path: string, status: number, durationMs: number) {
      const route = path.split("?")[0];
      httpRequestsTotal.inc({ method, path: route, status: String(status) });
      httpRequestDuration.observe({ method, path: route }, durationMs / 1000);
    },
    async metricsHandler(_req: Request, res: Response) {
      res.setHeader("Content-Type", registry.contentType);
      res.send(await registry.metrics());
    },
  };
}
