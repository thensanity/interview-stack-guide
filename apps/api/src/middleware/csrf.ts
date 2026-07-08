import type { Request, Response, NextFunction } from "express";

/** CSRF double-submit demo — interview: protect cookie-based sessions */
export function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.path.startsWith("/api/auth/login")) return next();

  const header = req.headers["x-csrf-token"] as string | undefined;
  const cookie = req.headers.cookie?.match(/csrf_token=([^;]+)/)?.[1];

  if (process.env.ENABLE_CSRF === "true" && (!header || !cookie || header !== cookie)) {
    return res.status(403).json({ error: "CSRF token mismatch" });
  }
  next();
}
