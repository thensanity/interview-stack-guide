import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

/** Structured JSON logging — interview: correlate requests with traces and metrics */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = (req.headers["x-request-id"] as string) ?? randomUUID();
  const start = Date.now();
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const entry = {
      level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      user: req.user?.email ?? null,
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(entry));
  });

  next();
}
