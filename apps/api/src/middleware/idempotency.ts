import type { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";

const store = new Map<string, { status: number; body: unknown; expires: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;

/** Idempotency keys — interview: safe retries for POST mutations */
export function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "POST") return next();

  const key = req.headers["idempotency-key"] as string | undefined;
  if (!key) return next();

  const fingerprint = createHash("sha256")
    .update(`${key}:${req.path}:${JSON.stringify(req.body ?? {})}`)
    .digest("hex");

  const existing = store.get(fingerprint);
  if (existing && existing.expires > Date.now()) {
    return res.status(existing.status).json(existing.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    store.set(fingerprint, { status: res.statusCode, body, expires: Date.now() + TTL_MS });
    return originalJson(body);
  };

  next();
}
